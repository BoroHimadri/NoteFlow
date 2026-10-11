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
      You are a concise summarizer. Given the following note, produce:
      1) A one-sentence TL;DR summary.
      2) 3-6 bullet points of the most important key points.

      Use Markdown bullets. Return ONLY the summary and the key points, no extra text.

      Note:
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