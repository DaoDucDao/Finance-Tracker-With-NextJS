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
    <aside className="glass fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-border">
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-xl shadow-lg shadow-emerald-900/40">
            💵
          </span>
          <div>
            <h1 className="text-lg font-bold leading-tight">
              <span className="text-gradient">FinTracker</span>
            </h1>
            <p className="text-[11px] text-zinc-500">Personal Finance Manager</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
              )}
              <span className="text-lg transition-transform group-hover:scale-110">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-border px-4 py-4">
        <div className="flex items-center justify-between rounded-xl bg-accent px-3 py-2">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
        <p className="text-center text-[11px] text-muted-foreground">
          Data stored in localStorage
        </p>
      </div>
    </aside>
  );
}
