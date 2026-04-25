// src/app/dashboard/layout.tsx
"use client";
import Sidebar from "@/src/components/dashboard/Sidebar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if we are on a specific document page
  const isDocPage = pathname.includes("/documents/");

  return (
    <div className="flex">
      {!isDocPage && <Sidebar />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
