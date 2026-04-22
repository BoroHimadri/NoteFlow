import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // We use the function so a fresh client is made for the browser context
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  );
}
