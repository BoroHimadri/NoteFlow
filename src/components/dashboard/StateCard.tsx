interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  dotColor?: string; // tailwind bg color e.g. "bg-purple-500"
}

export default function StatCard({
  label,
  value,
  sub,
  dotColor,
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
      <p className="text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5">
        {label}
      </p>
      <p className="font-serif text-3xl text-zinc-900 dark:text-zinc-50 leading-none">
        {value}
      </p>
      {sub && (
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1.5 flex items-center gap-1.5">
          {dotColor && (
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ${dotColor}`}
            />
          )}
          {sub}
        </p>
      )}
    </div>
  );
}
