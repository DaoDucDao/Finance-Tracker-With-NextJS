"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { Category, Transaction } from "@/types";
import { useBudgets } from "@/hooks/useBudgets";
import { formatCurrency, getMonthKey } from "@/utils/format";

interface BudgetSnapshotProps {
  transactions: Transaction[];
  categories: Category[];
}

export default function BudgetSnapshot({
  transactions,
  categories,
}: BudgetSnapshotProps) {
  const { budgets } = useBudgets();
  const currentMonth = getMonthKey(new Date().toISOString());

  const rows = useMemo(() => {
    const spent = new Map<string, number>();
    transactions.forEach((t) => {
      if (t.type !== "expense" || getMonthKey(t.date) !== currentMonth) return;
      spent.set(t.categoryId, (spent.get(t.categoryId) ?? 0) + t.amount);
    });
    return budgets
      .map((b) => {
        const used = spent.get(b.categoryId) ?? 0;
        const pct = b.amount > 0 ? (used / b.amount) * 100 : 0;
        return {
          id: b.id,
          category: categories.find((c) => c.id === b.categoryId),
          used,
          amount: b.amount,
          pct,
        };
      })
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 4);
  }, [budgets, transactions, categories, currentMonth]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-400">Budget health</h3>
        <Link href="/budgets" className="text-xs text-emerald-400 hover:text-emerald-300">
          Manage →
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">
          No budgets set yet.
        </p>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => {
            const over = r.used > r.amount;
            const warn = r.pct >= 80 && !over;
            return (
              <div key={r.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-zinc-300">
                    <span>{r.category?.icon ?? "📦"}</span>
                    {r.category?.name ?? "Unknown"}
                  </span>
                  <span
                    className={
                      over
                        ? "text-red-400"
                        : warn
                        ? "text-amber-400"
                        : "text-zinc-500"
                    }
                  >
                    {formatCurrency(r.used)} / {formatCurrency(r.amount)}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${
                      over
                        ? "from-red-500 to-rose-600"
                        : warn
                        ? "from-amber-400 to-orange-500"
                        : "from-emerald-400 to-emerald-600"
                    }`}
                    style={{ width: `${Math.min(r.pct, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
