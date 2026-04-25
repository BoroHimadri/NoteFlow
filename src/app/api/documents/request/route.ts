import { createClient } from "@/src/services/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
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

  // 2. Add the guest to the collaborators table as 'pending'
  const { error } = await supabase.from("collaborators").insert([
    {
      document_id: id,
      email: user.email,
      user_id: user.id, // This is the guest's ID
      status: "pending",
    },
  ]);

  // If they already requested, Supabase will throw a 'unique constraint' error
  if (error) {
    return NextResponse.json(
      { error: "Request already sent or error occurred" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
