import { NextResponse } from "next/server";
import { askGemini, stripHtml } from "@/src/lib/gemini";
import {
  authenticateAiRequest,
  MAX_CONTENT_LENGTH,
  MAX_MESSAGE_LENGTH,
} from "@/src/lib/aiGuard";

export async function POST(req: Request) {
  try {
    const unauthorized = await authenticateAiRequest();
    if (unauthorized) return unauthorized;

    const { content, message } = await req.json();

    if (typeof content !== "string" || typeof message !== "string" || !content.trim() || !message.trim()) {
      return NextResponse.json(
        { error: "Content and message are required" },
        { status: 400 }
      );
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: "Content is too large" },
        { status: 413 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: "Message is too large" },
        { status: 413 }
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