import { createClient } from "@/src/services/supabase/server";
import { createDocumentSchema } from "@/src/validationSchema";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Fetch data (RLS will automatically filter for owner + collaborators)
  const { data, error } = await supabase
    .from("documents")
    .select("id, title, content, created_at, user_id, is_pinned") // Added user_id and is_pinned
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    documents: data, // Plural is usually better practice for arrays
  });
}

export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Validate the data against schema
  const validation = createDocumentSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.format() },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("documents")
    .insert([
      {
        title: validation.data.title,
        content: validation.data.content,
        user_id: user.id, // Manually injected from the secure session
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
