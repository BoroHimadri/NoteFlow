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
      You are a professional editor. Rewrite the following text to sound more professional, sophisticated, and clear. 
      Return ONLY the polished text. Do not include any headers, explanations, or introductory remarks.

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
