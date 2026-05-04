// layout.tsx — no conditional, always same HTML
"use client";

import Sidebar from "@/src/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 lg:pl-64">
        <div className="lg:p-8 w-full">{children}</div>
      </main>
    </div>
  );
}
