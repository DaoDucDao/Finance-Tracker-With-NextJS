"use client";

import { formatCurrency } from "@/utils/format";

interface StatCardProps {
  title: string;
  amount: number;
  icon: string;
  color: "green" | "red" | "blue" | "purple";
  subtitle?: string;
  format?: "currency" | "percent";
}

const colorMap = {
  green: {
    card: "from-emerald-600/20 to-emerald-600/5 border-emerald-600/30",
    text: "text-emerald-400",
    glow: "bg-emerald-500/15 text-emerald-300",
  },
  red: {
    card: "from-red-600/20 to-red-600/5 border-red-600/30",
    text: "text-red-400",
    glow: "bg-red-500/15 text-red-300",
  },
  blue: {
    card: "from-blue-600/20 to-blue-600/5 border-blue-600/30",
    text: "text-blue-400",
    glow: "bg-blue-500/15 text-blue-300",
  },
  purple: {
    card: "from-purple-600/20 to-purple-600/5 border-purple-600/30",
    text: "text-purple-400",
    glow: "bg-purple-500/15 text-purple-300",
  },
};

export default function StatCard({
  title,
  amount,
  icon,
  color,
  subtitle,
  format = "currency",
}: StatCardProps) {
  const c = colorMap[color];
  const display = format === "percent" ? `${amount}%` : formatCurrency(amount);
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${c.card} p-5 shadow-lg shadow-black/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >
      {/* subtle sheen on hover */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/5 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      <div className="mb-4 flex items-start justify-between">
        <span className="text-sm font-medium text-zinc-400">{title}</span>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${c.glow}`}
        >
          {icon}
        </span>
      </div>
      <p className={`text-3xl font-bold tracking-tight ${c.text}`}>{display}</p>
      {subtitle && <p className="mt-1.5 text-xs text-zinc-500">{subtitle}</p>}
    </div>
  );
}
