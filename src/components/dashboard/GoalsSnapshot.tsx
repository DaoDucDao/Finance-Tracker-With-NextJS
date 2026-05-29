"use client";

import Link from "next/link";
import { useGoals } from "@/hooks/useGoals";
import { formatCurrency } from "@/utils/format";

export default function GoalsSnapshot() {
  const { goals } = useGoals();
  const top = [...goals]
    .map((g) => ({
      ...g,
      pct:
        g.targetAmount > 0
          ? Math.min((g.currentAmount / g.targetAmount) * 100, 100)
          : 0,
    }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 4);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-400">Savings goals</h3>
        <Link href="/goals" className="text-xs text-emerald-400 hover:text-emerald-300">
          View all →
        </Link>
      </div>

      {top.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">No goals yet.</p>
      ) : (
        <div className="space-y-4">
          {top.map((g) => (
            <div key={g.id}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-zinc-300">
                  <span>{g.icon}</span>
                  {g.name}
                </span>
                <span className="text-zinc-500">
                  {formatCurrency(g.currentAmount)} / {formatCurrency(g.targetAmount)}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${g.pct}%`,
                    backgroundColor: g.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
