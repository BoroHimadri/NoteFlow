"use Client";

import Link from "next/link";
import { Home, User, Settings } from "lucide-react";

const SidebarContent = () => {
  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];
  return (
    <div className="flex h-full flex-col bg-background border-r p-4">
      <h2 className=" text-xl font-bold mb-6">My Notes</h2>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition"
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default SidebarContent;
