"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/src/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDocumentPage = pathname?.includes("/documents/");

  return (
    <div className="flex">
      <Sidebar />
      <main className={`flex-1 ${isDocumentPage ? "" : "lg:pl-64"}`}>
        <div className={`${isDocumentPage ? "" : "lg:p-8"} w-full`}>{children}</div>
      </main>
    </div>
  );
}
