// app/auth/actions.ts
"use server";

import { createClient } from "@/src/services/supabase/server";
import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = await createClient();

  // This clears the session and the cookies
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error.message);
    // You could return an error here, but usually, we just redirect anyway
  }

  // Redirect to the home page or sign-in page
  redirect("/auth/sign-in");
}
