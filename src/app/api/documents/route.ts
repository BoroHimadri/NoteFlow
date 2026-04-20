import { supabase } from "@/src/services/supabaseClient";
import { NextResponse } from "next/server";
export async function GET() {
  const { data, error } = await supabase
    .from("documents")
    .select("id, title, content, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Supabase error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    document: data,
  });
}
