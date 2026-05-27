"use client";

import { formatCurrency } from "@/utils/format";

interface StatCardProps {
  title: string;
  amount: number;
  icon: string;
  color: "green" | "red" | "blue" | "purple";
  subtitle?: string;
}

const colorMap = {
  green: "from-emerald-600/20 to-emerald-600/5 border-emerald-600/30 text-emerald-400",
  red: "from-red-600/20 to-red-600/5 border-red-600/30 text-red-400",
  blue: "from-blue-600/20 to-blue-600/5 border-blue-600/30 text-blue-400",
  purple: "from-purple-600/20 to-purple-600/5 border-purple-600/30 text-purple-400",
};

export default function StatCard({ title, amount, icon, color, subtitle }: StatCardProps) {
  return (
    <div
      className={`bg-gradient-to-br ${colorMap[color]} border rounded-2xl p-5 transition-transform hover:scale-[1.02]`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-zinc-400 text-sm font-medium">{title}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`text-2xl font-bold ${colorMap[color].split(" ").pop()}`}>
        {formatCurrency(amount)}
      </p>
      {subtitle && <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>}
    </div>
  );
}
