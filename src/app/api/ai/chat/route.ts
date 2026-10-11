import { NextResponse } from "next/server";
import { askGemini, stripHtml } from "@/src/lib/gemini";

export async function POST(req: Request) {
  try {
    const { content, message } = await req.json();

    if (!content || !message) {
      return NextResponse.json(
        { error: "Content and message are required" },
        { status: 400 }
      );
    }

    const plainText = stripHtml(content);

    const prompt = `
      You are a helpful assistant embedded inside a note-taking app.
      Answer the user's question using ONLY the note content below.
      If the answer is not found in the note, say clearly that the note doesn't cover it.
      Be concise and friendly.

      Note content:
      ${plainText}

      User question:
      ${message}
    `;

    const reply = await askGemini(prompt);

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("Gemini Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate AI response";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}