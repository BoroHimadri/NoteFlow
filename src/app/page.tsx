"use client";
import Image from "next/image";
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div>
          <h1>Welcome to NoteFlow</h1>
          <a href="/auth/sign-in">Login</a>
        </div>
      </main>
    </div>
  );
}
