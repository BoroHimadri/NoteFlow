import { createClient } from "@/src/services/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || id === "undefined" || id.length < 10) {
      return NextResponse.json({ error: "Invalid UUID" }, { status: 400 });
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 404 });

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    if (!id || id === "undefined") {
      return NextResponse.json(
        { error: "Invalid UUID format" },
        { status: 400 }
      );
    }

    const { title, content } = await request.json();
    const supabase = createClient();

    const { data, error } = await supabase
      .from("documents")
      .update({ title, content })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Server Crash:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
