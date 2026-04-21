"use client";

import NewNoteCard from "@/src/components/dashboard/NewNoteCard";
import NoteCard from "@/src/components/dashboard/NoteCard";
import NoteCardSkeleton from "@/src/components/dashboard/NoteCardSkeleton";
import StatCard from "@/src/components/dashboard/StateCard";
import api from "@/src/lib/axios";
import { Note } from "@/src/types";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

const PINNED_NOTES: Note[] = [
  {
    id: "1",
    title: "Q3 Product Roadmap",
    content:
      "Finalize the feature list for the next release cycle. Key areas include onboarding revamp, AI suggestions rollout, and the new collaboration layer. Align with design team by end of month.",
    tag: "work",
    pinned: true,
    updatedAt: "Today, 10:42 am",
  },
  {
    id: "2",
    title: "Competitive Analysis — Note Apps",
    content:
      "Notion vs Obsidian vs Roam vs Bear. Key differentiators: linking, offline mode, export options. Notion dominates teams, Obsidian owns the power user segment. Gap: elegant mobile-first with AI.",
    tag: "research",
    pinned: true,
    updatedAt: "Yesterday, 3:15 pm",
  },
  {
    id: "3",
    title: "AI Features Brainstorm",
    content:
      "Auto-summarise long notes on open. Smart tagging from content. Continue writing button. Weekly digest email. Ask questions about your notes — semantic search over personal knowledge base.",
    tag: "ideas",
    updatedAt: "Mon, Apr 18",
  },
  {
    id: "4",
    title: "Books to Read in 2025",
    content:
      "Finished: Thinking Fast & Slow. Currently: The Almanack of Naval. Queue: Four Thousand Weeks, A Mind for Numbers, Deep Work (reread), Antifragile, Sapiens.",
    tag: "personal",
    updatedAt: "Sun, Apr 13",
  },
  {
    id: "5",
    title: "Weekly Reflection — Apr 14",
    content:
      "Shipped the auth flow. Spent too long on styling decisions — need to timebox better. Good sync with the backend team. Feeling clearer about the product direction. Next week: focus on the editor.",
    tag: "journal",
    updatedAt: "Sun, Apr 14",
  },
];

const fetchDocuments = async () => {
  // We use '/hello' because the baseURL is already '/api'
  const { data } = await api.get("/documents");
  console.log(data);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-zinc-900 dark:text-zinc-50">
            Good morning 👋
          </h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
            Here's what you've been working on
          </p>
        </div>
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

          {/* ── Data ── */}
          {data?.document?.map((note: Note) => (
            <NoteCard key={note.id} note={note} />
          ))}

          {/* Always show the new note card when not loading */}
          {!isLoading && <NewNoteCard />}
        </div>
      </section>
    </div>
  );
}
