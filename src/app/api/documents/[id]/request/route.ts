import { createClient } from "@/src/services/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Get the GUEST'S info from the session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 }
    );
  }

  // 2. Add or update the guest in the collaborators table as 'pending'
  // Use upsert to handle cases where they click twice or re-request after a decline
  const { error } = await supabase.from("collaborators").upsert(
    [
      {
        document_id: id,
        email: user.email,
        user_id: user.id,
        status: "pending",
      },
    ],
    { onConflict: "document_id,user_id" }
  );

  if (error) {
    console.error("Supabase Request Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
