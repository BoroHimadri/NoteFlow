import { Skeleton } from "../ui/skeleton";

export default function NoteCardSkeleton() {
  return (
    <div className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
      {/* Tag pill */}
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      {/* Title */}
      <Skeleton className="h-5 w-3/4 rounded-lg mb-2" />

      {/* Preview lines */}
      <div className="space-y-2 flex-1">
        <Skeleton className="h-3.5 w-full rounded-md" />
        <Skeleton className="h-3.5 w-full rounded-md" />
        <Skeleton className="h-3.5 w-2/3 rounded-md" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <Skeleton className="h-3 w-24 rounded-md" />
        <Skeleton className="h-3 w-12 rounded-md" />
      </div>
    </div>
  );
}
