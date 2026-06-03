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
  green: { icon: "bg-emerald-500/15 text-emerald-500", accent: "bg-emerald-500" },
  red: { icon: "bg-red-500/15 text-red-500", accent: "bg-red-500" },
  blue: { icon: "bg-blue-500/15 text-blue-500", accent: "bg-blue-500" },
  purple: { icon: "bg-violet-500/15 text-violet-500", accent: "bg-violet-500" },
};

export default function StatCard({
  title,
  amount,
  icon,
  color,
  subtitle,
  format = "currency",
}: StatCardProps) {
  const palette = colorMap[color];
  const display = format === "percent" ? `${amount}%` : formatCurrency(amount);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-lg">
      {/* colored accent strip */}
      <span
        className={`absolute inset-x-0 top-0 h-1 ${palette.accent} opacity-80`}
      />

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${palette.icon}`}
        >
          {icon}
        </span>
      </div>

      <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">
        {display}
      </p>
      {subtitle && (
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
