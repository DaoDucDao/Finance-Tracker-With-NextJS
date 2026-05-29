"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/transactions", label: "Transactions", icon: "💳" },
  { href: "/budgets", label: "Budgets", icon: "🎯" },
  { href: "/goals", label: "Goals", icon: "🏆" },
  { href: "/categories", label: "Categories", icon: "🏷️" },
  { href: "/reports", label: "Reports", icon: "📈" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col z-40">
      <div className="px-6 py-6 border-b border-zinc-800">
        <h1 className="text-xl font-bold">
          💵 <span className="text-gradient">FinTracker</span>
        </h1>
        <p className="text-xs text-zinc-500 mt-1">Personal Finance Manager</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-emerald-600/20 text-emerald-400"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Theme</span>
          <ThemeToggle />
        </div>
        <p className="text-xs text-zinc-600 text-center">
          Data stored in localStorage
        </p>
      </div>
    </aside>
  );
}
