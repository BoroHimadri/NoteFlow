"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import api from "@/src/lib/axios";

export default function NewNoteCard() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/documents", {
        title: "Untitled Note",
        content: "",
      });

      // Based on your log:
      // response.data is { success: true, data: { id: '...', ... } }
      return response.data.data;
    },
    onSuccess: (newDoc) => {
      if (newDoc?.id) {
        // Direct hit!
        router.push(`/dashboard/documents/${newDoc.id}`);
      } else {
        console.error("ID still missing from newDoc:", newDoc);
      }
    },
  });

  return (
    <button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className="flex flex-col items-center justify-center gap-3 min-h-45 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-purple-400 transition-all cursor-pointer w-full group disabled:opacity-50"
    >
      <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center text-xl font-light group-hover:bg-purple-100 transition-colors">
        {mutation.isPending ? "..." : "+"}
      </div>
      <span className="text-sm text-zinc-400 group-hover:text-zinc-600">
        {mutation.isPending ? "Creating..." : "New note"}
      </span>
    </button>
  );
}
