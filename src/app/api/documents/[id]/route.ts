import { createClient } from "@/src/services/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createClient();

    // 1. Fetch the document FIRST
    const { data: doc, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !doc)
      return NextResponse.json({ error: "Document not found" }, { status: 404 });

    // 2. Case A: Document is PUBLIC - Allow everyone immediately
    if (doc.is_public === true) {
      return NextResponse.json({ success: true, data: doc });
    }

    // 3. Get current user for private documents
    const { data: { user } } = await supabase.auth.getUser();

    // 4. Case B: Document is PRIVATE and user is not logged in
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 5. Case C: User is the OWNER
    if (doc.user_id === user.id) {
      return NextResponse.json({ success: true, data: doc });
    }

    // 6. Case D: Check if user is an accepted collaborator
    const { data: collaborator } = await supabase
      .from("collaborators")
      .select("*")
      .eq("document_id", id)
      .eq("user_id", user.id)
      .eq("status", "accepted")
      .single();

    if (collaborator) {
      return NextResponse.json({ success: true, data: doc });
    }

    // 7. Case E: Access Required (Redirect to request screen)
    return NextResponse.json({ error: "Access Required" }, { status: 403 });
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
    const canUpdate = doc.user_id === user.id; // Only owner for now for is_public, but let's allow edits for collaborators
    
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

    if (!canUpdate && !isCollaborator) {
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
