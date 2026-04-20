"use client";

import { useRouter } from "next/navigation";

export default function NewNoteCard() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/notes/new")}
      className="
        flex flex-col items-center justify-center gap-3
        min-h-45 rounded-2xl
        border border-dashed border-zinc-300 dark:border-zinc-700
        hover:border-purple-400 dark:hover:border-purple-600
        hover:bg-purple-50/40 dark:hover:bg-purple-950/20
        transition-all duration-200 cursor-pointer w-full
        group
      "
    >
      <div
        className="
        w-8 h-8 rounded-full
        bg-purple-50 dark:bg-purple-950
        text-purple-600 dark:text-purple-400
        flex items-center justify-center
        text-xl font-light leading-none
        group-hover:bg-purple-100 dark:group-hover:bg-purple-900
        transition-colors
      "
      >
        +
      </div>
      <span className="text-sm text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
        New note
      </span>
    </button>
  );
}
