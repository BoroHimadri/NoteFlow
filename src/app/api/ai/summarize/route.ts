import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_GOOGLE_API_KEY!);

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Strip HTML tags for cleaner processing
    const plainText = content.replace(/<[^>]*>/g, "");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are a professional editor and writing assistant. 
      Your task is to take the following text and rewrite it to sound more professional, sophisticated, and clear. 
      Improve the vocabulary, fix any awkward phrasing, and ensure a confident, business-appropriate tone while keeping the original meaning intact.

      Format your response by providing the 'Polished Version' first, followed by a brief 'Key Improvements' section explaining what was changed.

      Text to polish:
      ${plainText}
    `;

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    return NextResponse.json({ summary: aiResponse });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate AI response" },
      { status: 500 }
    );
  }
}
