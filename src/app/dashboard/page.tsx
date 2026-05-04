"use client";

import NewNoteCard from "@/src/components/dashboard/NewNoteCard";
import NoteCard from "@/src/components/dashboard/NoteCard";
import NoteCardSkeleton from "@/src/components/dashboard/NoteCardSkeleton";
import StatCard from "@/src/components/dashboard/StateCard";
import api from "@/src/lib/axios";
import { Note } from "@/src/types";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

const fetchDocuments = async () => {
  const { data } = await api.get("/documents");
  return data;
};

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["documents"],
    queryFn: fetchDocuments,
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Page heading */}
      <div className=" flex flex-col">
        <h1 className="font-serif text-2xl text-zinc-900 dark:text-zinc-50 mt-7 lg:mt-0">
          Good morning 👋
        </h1>
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          Here's what you've been working on
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Total notes"
          value={48}
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
          value={5}
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
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[11px] uppercase tracking-widest font-medium text-zinc-400 dark:text-zinc-500">
            Pinned notes
          </h2>
          <a
            href="/notes?filter=pinned"
            className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
          >
            See all →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* ── Loading ── */}
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
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
          {data?.documents?.map((note: Note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </section>
    </div>
  );
}
