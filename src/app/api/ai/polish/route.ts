import { NextResponse } from "next/server";
import { askGemini, stripHtml } from "@/src/lib/gemini";
import {
  authenticateAiRequest,
  MAX_CONTENT_LENGTH,
} from "@/src/lib/aiGuard";

export async function POST(req: Request) {
  try {
    const unauthorized = await authenticateAiRequest();
    if (unauthorized) return unauthorized;

    const { content } = await req.json();

    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: "Content is too large" },
        { status: 413 }
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