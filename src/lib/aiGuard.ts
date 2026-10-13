import { NextResponse } from "next/server";
import { createClient } from "@/src/services/supabase/server";
import { rateLimit } from "@/src/lib/rateLimit";

export const MAX_CONTENT_LENGTH = 10_000;
export const MAX_MESSAGE_LENGTH = 2_000;
const AI_RATE_LIMIT = 20;
const AI_RATE_WINDOW_MS = 60_000;

export async function authenticateAiRequest() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = await rateLimit(`ai:${user.id}`, AI_RATE_LIMIT, AI_RATE_WINDOW_MS);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.ceil((limit.resetAt - Date.now()) / 1000)
          ),
        },
      }
    );
  }

  return null;
}
