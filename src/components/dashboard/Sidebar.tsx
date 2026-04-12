"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

import SidebarContent from "./Sidebarcontent";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-screen fixed left-0 top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 lg:border-b">
        <h1 className="font-semibold hidden">My App</h1>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="p-0 w-64">
            {/* 👇 Required for accessibility */}
            <SheetTitle className="sr-only">Sidebar Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Navigation links for the dashboard
            </SheetDescription>

            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
