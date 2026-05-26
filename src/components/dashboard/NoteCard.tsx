"use client";

import { formatDate, stripHtml } from "@/src/lib/helper";
import { Note } from "@/src/types";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { Pin, PinOff, Edit3, Trash2, ArrowUpRight } from "lucide-react";

const PREVIEW_LENGTH = 160;

interface NoteCardProps {
  note: Note;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPin?: (id: string, isPinned: boolean) => void;
}

export default function NoteCard({
  note,
  onEdit,
  onDelete,
  onPin,
}: NoteCardProps) {
  const router = useRouter();
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
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/dashboard/documents/${note.id}`);
      }}
    >
      <span
        className={`absolute top-0 left-0 right-0 h-0.5 ${
          note.is_pinned ? "bg-purple-500" : "bg-transparent"
        } rounded-t-2xl transition-colors`}
      />

      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 w-full justify-between">
          <div className="flex items-center gap-2">
            {note.is_pinned && (
              <Pin className="w-3 h-3 text-purple-500 fill-purple-500" />
            )}
          </div>
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {onPin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPin(note.id, !note.is_pinned);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  note.is_pinned
                    ? "text-purple-600 bg-purple-50 dark:bg-purple-900/30"
                    : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
                aria-label={note.is_pinned ? "Unpin note" : "Pin note"}
              >
                {note.is_pinned ? (
                  <PinOff className="w-3.5 h-3.5" />
                ) : (
                  <Pin className="w-3.5 h-3.5" />
                )}
              </button>
            )}
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(note.id);
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Edit note"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note.id);
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                aria-label="Delete note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-serif text-base font-normal text-zinc-900 dark:text-zinc-50 leading-snug mb-2">
        {note.title}
      </h3>

      {/* Preview */}
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1">
        {stripHtml(note.content)}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
          {formatDate(note.created_at)}
        </span>
        {/* <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
       Last Updated   {formatDate(note.created_at)}
        </span> */}
        <Link
          href={`/dashboard/documents/${note.id}`}
          className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Open →
        </Link>
      </div>
    </div>
  );
}
