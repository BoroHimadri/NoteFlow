import { createClient } from "@/src/services/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Fetch all pending collaborator requests
    const { data: allRequests, error: collabError } = await supabase
      .from("collaborators")
      .select("*")
      .eq("status", "pending");

    if (collabError) {
      console.error("Collab Fetch Error:", collabError.message);
      return NextResponse.json({ error: collabError.message }, { status: 500 });
    }

    console.log("Found raw pending requests:", allRequests?.length || 0);

    if (!allRequests || allRequests.length === 0) {
      return NextResponse.json({ success: true, requests: [] });
    }

    // 2. Fetch the documents associated with these requests to verify ownership
    const requestDocIds = [...new Set(allRequests.map(r => r.document_id))];
    
    const { data: relatedDocs, error: docError } = await supabase
      .from("documents")
      .select("id, title, user_id")
      .in("id", requestDocIds);

    if (docError) {
      console.error("Docs Fetch Error:", docError.message);
      return NextResponse.json({ error: docError.message }, { status: 500 });
    }

    // 3. Combine and filter: Only keep requests for documents owned by the current user
    const filteredRequests = allRequests
      .map(request => {
        const doc = relatedDocs.find(d => d.id === request.document_id);
        return { ...request, documents: doc };
      })
      .filter(request => request.documents?.user_id === user.id);

    console.log("Filtered requests for owner:", filteredRequests.length);

    return NextResponse.json({ success: true, requests: filteredRequests });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// To approve/decline
export async function PATCH(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { requestId, status } = await request.json(); // status: 'accepted' or 'declined'

    if (!requestId || !status) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Verify ownership of the document associated with this request
    const { data: collabRequest } = await supabase
      .from("collaborators")
      .select("document_id")
      .eq("id", requestId)
      .single();

    if (!collabRequest) return NextResponse.json({ error: "Request not found" }, { status: 404 });

    const { data: doc } = await supabase
      .from("documents")
      .select("user_id")
      .eq("id", collabRequest.document_id)
      .single();

    if (!doc || doc.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update status
    const { error } = await supabase
      .from("collaborators")
      .update({ status })
      .eq("id", requestId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
