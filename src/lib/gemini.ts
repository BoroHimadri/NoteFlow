import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_GOOGLE_API_KEY!);

const MODEL = "gemini-2.5-flash";

// Tiptap stores notes as HTML; the AI only needs plain text.
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

// One place that talks to Gemini. Every AI endpoint reuses this.
export async function askGemini(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: MODEL });
  const result = await model.generateContent(prompt);
  return result.response.text();
}