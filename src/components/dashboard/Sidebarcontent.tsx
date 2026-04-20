"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Pin,
  Tag,
  Trash2,
  Settings,
  User,
  PenLine,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "Menu",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "All Notes", href: "/notes", icon: FileText },
      { name: "Pinned", href: "/notes?filter=pinned", icon: Pin },
      { name: "Tags", href: "/tags", icon: Tag },
      { name: "Trash", href: "/trash", icon: Trash2 },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Profile", href: "/profile", icon: User },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export default function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 px-3 py-5">
      {/* Brand */}
      <div className="px-3 mb-6 ">
        <span className="font-serif text-xl text-zinc-900 dark:text-zinc-50 tracking-tight">
          Note
          <span className="italic text-purple-600 dark:text-purple-400">
            Flow
          </span>
        </span>
      </div>

      {/* New Note button */}
      <div className="px-1 mb-6">
        <Link
          href="/notes/new"
          className="
            flex items-center gap-2 w-full
            bg-purple-600 hover:bg-purple-700
            text-white text-sm font-medium
            px-3 py-2 rounded-xl
            transition-colors duration-150
          "
        >
          <PenLine className="w-4 h-4" />
          New note
        </Link>
      </div>

      {/* Nav sections */}
      <nav className="flex flex-col gap-5 flex-1">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="text-[10px] uppercase tracking-widest font-medium text-zinc-400 dark:text-zinc-500 px-3 mb-1.5">
              {section.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-xl text-sm
                      transition-colors duration-150
                      ${
                        isActive
                          ? "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 font-medium"
                          : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                      }
                    `}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-purple-600 dark:text-purple-400" : ""
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User pill at the bottom */}
      <div className="mt-4 px-1">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-xs font-medium text-purple-700 dark:text-purple-300 shrink-0">
            AK
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 truncate leading-none mb-0.5">
              Test User
            </p>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate">
              test@noteflow.app
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
