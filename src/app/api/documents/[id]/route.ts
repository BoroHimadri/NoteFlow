import { createClient } from "@/src/services/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createClient();

    // 1. A logged-in user is ALWAYS required to open a note (public or not)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch the document
    const { data: doc, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !doc)
      return NextResponse.json({ error: "Document not found" }, { status: 404 });

    // 3. Case A: User is the OWNER
    if (doc.user_id === user.id) {
      return NextResponse.json({
        success: true,
        data: { ...doc, canEdit: true, isOwner: true },
      });
    }

    // 4. Check if user is an accepted collaborator
    const { data: collaborator } = await supabase
      .from("collaborators")
      .select("status")
      .eq("document_id", id)
      .eq("user_id", user.id)
      .eq("status", "accepted")
      .single();

    const canEdit = !!collaborator;

    // 5. Case B: Public document - any logged-in user can edit it collaboratively
    if (doc.is_public === true) {
      return NextResponse.json({
        success: true,
        data: { ...doc, canEdit: true, isOwner: false },
      });
    }

    // 6. Case C: Private and not an accepted collaborator
    if (!canEdit) {
      return NextResponse.json({ error: "Access Required" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: { ...doc, canEdit: true, isOwner: false },
    });
  } catch (err: any) {
    console.error("GET Document Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title, content, is_public, is_pinned } = await request.json();
    const supabase = createClient();

    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. Fetch the document to check ownership/permissions
    const { data: doc } = await supabase
      .from("documents")
      .select("user_id, is_public, is_pinned")
      .eq("id", id)
      .single();

    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // 3. Update logic
    const canUpdate = doc.user_id === user.id;
    const docIsPublic = doc.is_public === true; // Public notes are collaboratively editable

    // Check if user is an accepted collaborator if not owner
    let isCollaborator = false;
    if (!canUpdate) {
      const { data: collaborator } = await supabase
        .from("collaborators")
        .select("status")
        .eq("document_id", id)
        .eq("user_id", user.id)
        .eq("status", "accepted")
        .single();
      if (collaborator) isCollaborator = true;
    }

    if (!canUpdate && !isCollaborator && !docIsPublic) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Build update object
    const updateObj: any = {};
    if (title !== undefined) updateObj.title = title;
    if (content !== undefined) updateObj.content = content;
    if (is_pinned !== undefined) updateObj.is_pinned = is_pinned;
    // Only owner can change public status
    if (is_public !== undefined && doc.user_id === user.id) {
      updateObj.is_public = is_public;
    }

    const { data, error } = await supabase
      .from("documents")
      .update(updateObj)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
