"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/src/components/dashboard/Sidebar";
import { useRealtimeAccessRequests } from "@/src/hooks/useRealtimeAccessRequests";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDocumentPage = pathname?.includes("/documents/");

  useRealtimeAccessRequests();

  return (
    <div className="flex">
      {!isDocumentPage && <Sidebar />}
      <main className={`flex-1 ${isDocumentPage ? "" : "lg:pl-64"}`}>
        <div className={`${isDocumentPage ? "" : "lg:p-8"} w-full`}>{children}</div>
      </main>
    </div>
  );
}
