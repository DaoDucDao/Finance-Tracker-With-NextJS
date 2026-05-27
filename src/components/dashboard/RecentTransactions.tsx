"use client";

import type { Transaction, Category } from "@/types";
import { formatCurrency, formatDate } from "@/utils/format";
import Link from "next/link";

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: Category[];
}

export default function RecentTransactions({
  transactions,
  categories,
}: RecentTransactionsProps) {
  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-zinc-400">Recent Transactions</h3>
        <Link
          href="/transactions"
          className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          View all &rarr;
        </Link>
      </div>

      {recent.length === 0 ? (
        <p className="text-zinc-500 text-center py-8">No transactions yet</p>
      ) : (
        <div className="space-y-3">
          {recent.map((t) => {
            const cat = categoryMap.get(t.categoryId);
            return (
              <div
                key={t.id}
                className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm"
                    style={{ backgroundColor: (cat?.color ?? "#64748b") + "20" }}
                  >
                    {cat?.icon ?? "?"}
                  </span>
                  <div>
                    <p className="text-sm text-zinc-200">{t.description}</p>
                    <p className="text-xs text-zinc-500">
                      {cat?.name ?? "Unknown"} &middot; {formatDate(t.date)}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-medium ${
                    t.type === "income" ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
