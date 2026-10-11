import { NextResponse } from "next/server";
import { askGemini, stripHtml } from "@/src/lib/gemini";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const plainText = stripHtml(content);

    const prompt = `
      Continue writing the following note naturally from where it ends.
      Match the existing tone, topic, and style. The result will be appended to the note.
      Return ONLY the continuation text with no headers, explanations, or opening remarks.

      Note so far:
      ${plainText}
    `;

    const continuation = await askGemini(prompt);

    return NextResponse.json({ summary: continuation });
  } catch (error: unknown) {
    console.error("Gemini Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate AI response";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}