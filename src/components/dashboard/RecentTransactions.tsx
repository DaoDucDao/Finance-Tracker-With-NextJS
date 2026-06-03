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
  const categoryMap = new Map(
    categories.map((category) => [category.id, category])
  );
  const recent = [...transactions]
    .sort(
      (first, second) =>
        new Date(second.date).getTime() - new Date(first.date).getTime()
    )
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
          {recent.map((transaction) => {
            const category = categoryMap.get(transaction.categoryId);

            return (
              <div
                key={transaction.id}
                className="-mx-2 flex items-center justify-between rounded-xl px-2 py-2 transition-colors hover:bg-secondary/50"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-sm"
                    style={{ backgroundColor: (category?.color ?? "#64748b") + "20" }}
                  >
                    {category?.icon ?? "?"}
                  </span>
                  <div>
                    <p className="text-sm text-foreground">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {category?.name ?? "Unknown"} &middot; {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    transaction.type === "income" ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
