"use client";

import { useState, useEffect } from "react";
import NewNoteCard from "@/src/components/dashboard/NewNoteCard";
import NoteCard from "@/src/components/dashboard/NoteCard";
import NoteCardSkeleton from "@/src/components/dashboard/NoteCardSkeleton";
import StatCard from "@/src/components/dashboard/StateCard";
import api from "@/src/lib/axios";
import { Note } from "@/src/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, FileText, Pin } from "lucide-react";
import Notifications from "@/src/components/dashboard/Notifications";

const fetchDocuments = async () => {
  const { data } = await api.get("/documents");
  return data;
};

const togglePinDocument = async ({ id, is_pinned }: { id: string; is_pinned: boolean }) => {
  const { data } = await api.patch(`/documents/${id}`, { is_pinned });
  return data;
};

export default function Dashboard() {
  const queryClient = useQueryClient();
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

  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const pinnedNotes = data?.documents?.filter((note: Note) => note.is_pinned) || [];
  const recentNotes = data?.documents?.filter((note: Note) => !note.is_pinned).slice(0, 3) || [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">
      {/* Notifications Row */}
      <Notifications />

      {/* Page heading */}
      <div className=" flex flex-col">
        <h1 className="font-serif text-2xl text-zinc-900 dark:text-zinc-50 mt-7 lg:mt-0">
          {greeting} 👋
        </h1>
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          Here&apos;s what you&apos;ve been working on
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Total notes"
          value={data?.documents?.length || 0}
          sub="+3 this week"
          dotColor="bg-purple-500"
        />
        <StatCard
          label="Documents"
          value={12}
          sub="4 shared"
          dotColor="bg-violet-500"
        />
        <StatCard
          label="Pinned"
          value={pinnedNotes.length}
          sub="2 updated today"
          dotColor="bg-amber-500"
        />
        <StatCard
          label="Last edited"
          value="Today"
          sub="Meeting notes"
          dotColor="bg-blue-500"
        />
      </div>

      {/* Pinned notes */}
      <section>
        <div className="flex items-baseline justify-between mb-6">
          <div className="flex items-center gap-2">
            <Pin className="w-3.5 h-3.5 text-zinc-400" />
            <h2 className="text-[11px] uppercase tracking-widest font-medium text-zinc-400 dark:text-zinc-500">
              Pinned notes
            </h2>
          </div>
          <a
            href="/notes?filter=pinned"
            className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
          >
            See all →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* ── Loading ── */}
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <NoteCardSkeleton key={i} />
            ))}

          {/* ── Error ── */}
          {error && (
            <div className="col-span-full flex items-center gap-3 p-5 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-2xl text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Something went wrong loading your notes. Try refreshing the page.
            </div>
          )}
          {!isLoading && <NewNoteCard />}
          {/* ── Data ── */}
          {pinnedNotes.map((note: Note) => (
            <NoteCard key={note.id} note={note} onPin={handlePin} />
          ))}
        </div>
      </section>

      {/* Recent notes section */}
      <section>
        <div className="flex items-baseline justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            <h2 className="text-[11px] uppercase tracking-widest font-medium text-zinc-400 dark:text-zinc-500">
              Recent notes
            </h2>
          </div>
          <a
            href="/notes"
            className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
          >
            View all →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* ── Loading ── */}
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <NoteCardSkeleton key={i} />
            ))}

          {/* ── Data ── */}
          {!isLoading && recentNotes.map((note: Note) => (
            <NoteCard key={note.id} note={note} onPin={handlePin} />
          ))}
          
          {!isLoading && recentNotes.length === 0 && !pinnedNotes.length && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl">
              <p className="text-sm text-zinc-400">No notes yet. Click the card above to create one!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
