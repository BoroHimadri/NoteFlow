"use client";

import { Note, NoteTag } from "@/src/types";
import Link from "next/link";

const TAG_STYLES: Record<NoteTag, string> = {
  work: "bg-purple-50 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
  personal:
    "bg-violet-50 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
  ideas: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  research: "bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  journal: "bg-pink-50 text-pink-800 dark:bg-pink-950 dark:text-pink-300",
};

const PREVIEW_LENGTH = 160;

interface NoteCardProps {
  note: Note;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const preview =
    note.content.length > PREVIEW_LENGTH
      ? note.content.slice(0, PREVIEW_LENGTH).trimEnd() + "…"
      : note.content;

  return (
    <div
      className={`
        group relative flex flex-col bg-white dark:bg-zinc-900
        border border-zinc-200 dark:border-zinc-800
        rounded-2xl p-5 transition-all duration-200
        hover:-translate-y-0.5 hover:border-zinc-300 dark:hover:border-zinc-700
        hover:shadow-sm cursor-pointer overflow-hidden
      `}
    >
      <span className="absolute top-0 left-0 right-0 h-0.5 bg-purple-500 rounded-t-2xl" />

      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <span
          className={`
            text-[10px] font-semibold uppercase tracking-widest
            px-2.5 py-1 rounded-full
            ${TAG_STYLES[note.tag]}
          `}
        >
          {note.tag}
        </span>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {note.pinned && (
            <span className="text-purple-500 text-xs select-none">📌</span>
          )}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(note.id);
              }}
              className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-sm transition-colors"
              aria-label="Edit note"
            >
              ✎
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="text-zinc-400 hover:text-red-500 text-sm transition-colors"
              aria-label="Delete note"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-serif text-base font-normal text-zinc-900 dark:text-zinc-50 leading-snug mb-2">
        {note.title}
      </h3>

      {/* Preview */}
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1">
        {preview}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
          {note.updatedAt}
        </span>
        <Link
          href={`/notes/${note.id}`}
          className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Open →
        </Link>
      </div>
    </div>
  );
}
