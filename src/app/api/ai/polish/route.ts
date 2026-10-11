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
      You are a professional editor. Rewrite the following text to sound more professional, sophisticated, and clear.
      Return ONLY the polished text. Do not include any headers, explanations, or introductory remarks.

      Text to polish:
      ${plainText}
    `;

    const summary = await askGemini(prompt);

    return NextResponse.json({ summary });
  } catch (error: unknown) {
    console.error("Gemini Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate AI response";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}