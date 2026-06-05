"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { Budget, Category, Transaction } from "@/types";
import { formatCurrency, getMonthKey } from "@/utils/format";
import Card from "@/components/ui/card";

interface BudgetSnapshotProps {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
}

export default function BudgetSnapshot({
  transactions,
  categories,
  budgets,
}: BudgetSnapshotProps) {
  const currentMonth = getMonthKey(new Date().toISOString());

  const rows = useMemo(() => {
    const spent = new Map<string, number>();

    transactions.forEach((transaction) => {
      if (
        transaction.type !== "expense" ||
        getMonthKey(transaction.date) !== currentMonth
      )
        return;

      spent.set(
        transaction.categoryId,
        (spent.get(transaction.categoryId) ?? 0) + transaction.amount
      );
    });

    return budgets
      .map((budget) => {
        const used = spent.get(budget.categoryId) ?? 0;
        const percent = budget.amount > 0 ? (used / budget.amount) * 100 : 0;

        return {
          id: budget.id,
          category: categories.find((category) => category.id === budget.categoryId),
          used,
          amount: budget.amount,
          percent,
        };
      })
      .sort((first, second) => second.percent - first.percent)
      .slice(0, 4);
  }, [budgets, transactions, categories, currentMonth]);

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Budget health</h3>
        <Link
          href="/budgets"
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/10 hover:text-emerald-300"
        >
          Manage →
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">
          No budgets set yet.
        </p>
      ) : (
        <div className="space-y-4">
          {rows.map((row) => {
            const over = row.used > row.amount;
            const warning = row.percent >= 80 && !over;

            return (
              <div key={row.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-zinc-300">
                    <span>{row.category?.icon ?? "📦"}</span>
                    {row.category?.name ?? "Unknown"}
                  </span>
                  <span
                    className={
                      over
                        ? "text-red-400"
                        : warning
                        ? "text-amber-400"
                        : "text-zinc-500"
                    }
                  >
                    {formatCurrency(row.used)} / {formatCurrency(row.amount)}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${
                      over
                        ? "from-red-500 to-rose-600"
                        : warning
                        ? "from-amber-400 to-orange-500"
                        : "from-emerald-400 to-emerald-600"
                    }`}
                    style={{ width: `${Math.min(row.percent, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
