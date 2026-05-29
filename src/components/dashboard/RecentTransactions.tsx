"use client";

import type { Transaction, Category } from "@/types";
import { formatCurrency, formatDate } from "@/utils/format";
import Link from "next/link";
import { Card } from "@/components/ui/card";

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
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Recent Transactions
        </h3>
        <Link
          href="/transactions"
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/10 hover:text-emerald-300"
        >
          View all &rarr;
        </Link>
      </div>

      {recent.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">No transactions yet</p>
      ) : (
        <div className="space-y-1">
          {recent.map((t) => {
            const cat = categoryMap.get(t.categoryId);
            return (
              <div
                key={t.id}
                className="-mx-2 flex items-center justify-between rounded-xl px-2 py-2 transition-colors hover:bg-secondary/50"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-sm"
                    style={{ backgroundColor: (cat?.color ?? "#64748b") + "20" }}
                  >
                    {cat?.icon ?? "?"}
                  </span>
                  <div>
                    <p className="text-sm text-foreground">{t.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {cat?.name ?? "Unknown"} &middot; {formatDate(t.date)}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${
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
    </Card>
  );
}
