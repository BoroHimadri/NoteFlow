"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import SidebarContent from "./Sidebarcontent";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.includes("/documents/")) return null; // ← hide on doc pages

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <span className="font-serif text-xl text-zinc-900 dark:text-zinc-50 tracking-tight">
          Note
          <span className="italic text-purple-600 dark:text-purple-400">
            Flow
          </span>
        </span>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-xl border-zinc-200 dark:border-zinc-700"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Main navigation for NoteFlow
            </SheetDescription>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
