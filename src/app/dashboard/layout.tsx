import Sidebar from "../../components/dashboard/Sidebar";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Sidebar />
      <main className="pt-14 md:pt-0 md:ml-64">{children}</main>
    </div>
  );
}
