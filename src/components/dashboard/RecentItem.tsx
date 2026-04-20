import Link from "next/link";

interface RecentItemProps {
  id: string;
  title: string;
  tag: string;
  editedAt: string;
  iconBg: string; // tailwind bg color
  iconColor: string; // tailwind text color
  icon: string; // emoji or text glyph
}

export default function RecentItem({
  id,
  title,
  tag,
  editedAt,
  iconBg,
  iconColor,
  icon,
}: RecentItemProps) {
  return (
    <Link
      href={`/notes/${id}`}
      className="
        flex items-center gap-3 p-3.5
        bg-white dark:bg-zinc-900
        border border-zinc-200 dark:border-zinc-800
        rounded-xl
        hover:border-zinc-300 dark:hover:border-zinc-700
        transition-all duration-150
        group
      "
    >
      <div
        className={`
        w-9 h-9 rounded-lg flex items-center justify-center
        text-sm flex-shrink-0
        ${iconBg} ${iconColor}
      `}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 truncate group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
          {title}
        </p>
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 capitalize">
          {tag} · {editedAt}
        </p>
      </div>
      <span className="text-zinc-300 dark:text-zinc-600 text-xs group-hover:text-zinc-400 transition-colors">
        →
      </span>
    </Link>
  );
}
