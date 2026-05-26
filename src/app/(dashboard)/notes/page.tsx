"use client";

import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/lib/axios";
import { Note } from "@/src/types";
import NoteCard from "@/src/components/dashboard/NoteCard";
import NoteCardSkeleton from "@/src/components/dashboard/NoteCardSkeleton";
import NewNoteCard from "@/src/components/dashboard/NewNoteCard";
import { AlertCircle, FileText, Pin } from "lucide-react";
import { Suspense } from "react";

const fetchDocuments = async () => {
  const { data } = await api.get("/documents");
  return data;
};

const togglePinDocument = async ({ id, is_pinned }: { id: string; is_pinned: boolean }) => {
  const { data } = await api.patch(`/documents/${id}`, { is_pinned });
  return data;
};

function NotesContent() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");

  const { data, isLoading, error } = useQuery({
    queryKey: ["documents"],
    queryFn: fetchDocuments,
  });

  const pinMutation = useMutation({
    mutationFn: togglePinDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  const handlePin = (id: string, isPinned: boolean) => {
    pinMutation.mutate({ id, is_pinned: isPinned });
  };

  const notes = data?.documents || [];
  const filteredNotes = filter === "pinned" 
    ? notes.filter((note: Note) => note.is_pinned) 
    : notes;

  const title = filter === "pinned" ? "Pinned Notes" : "All Notes";
  const Icon = filter === "pinned" ? Pin : FileText;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Page heading */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mt-7 lg:mt-0">
          <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h1 className="font-serif text-2xl text-zinc-900 dark:text-zinc-50">
            {title}
          </h1>
        </div>
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          {filter === "pinned" 
            ? "Your most important thoughts, all in one place" 
            : "Browse and manage all your personal notes"}
        </p>
      </div>

      {/* Notes Grid */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* ── Loading ── */}
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <NoteCardSkeleton key={i} />
            ))}

          {/* ── Error ── */}
          {error && (
            <div className="col-span-full flex items-center gap-3 p-5 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-2xl text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Something went wrong loading your notes. Try refreshing the page.
            </div>
          )}

          {/* ── New Note Card ── */}
          {!isLoading && filter !== "pinned" && <NewNoteCard />}

          {/* ── Data ── */}
          {!isLoading && filteredNotes.map((note: Note) => (
            <NoteCard key={note.id} note={note} onPin={handlePin} />
          ))}

          {/* ── Empty State ── */}
          {!isLoading && filteredNotes.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                No {filter === "pinned" ? "pinned " : ""}notes found
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                {filter === "pinned" 
                  ? "Start pinning your important notes to see them here." 
                  : "You haven't created any notes yet. Start by creating your first note!"}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function AllNotes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotesContent />
    </Suspense>
  );
}
