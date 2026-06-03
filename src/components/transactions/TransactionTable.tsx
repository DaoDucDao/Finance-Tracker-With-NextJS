"use client";

import type { Transaction, Category } from "@/types";
import { formatCurrency, formatDate } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TransactionTableProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionTable({
  transactions,
  categories,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  const categoryMap = new Map(
    categories.map((category) => [category.id, category])
  );

  const sorted = [...transactions].sort(
    (first, second) =>
      new Date(second.date).getTime() - new Date(first.date).getTime()
  );

  if (sorted.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No transactions found</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs text-zinc-500 font-medium px-5 py-3">
                Date
              </th>
              <th className="text-left text-xs text-zinc-500 font-medium px-5 py-3">
                Description
              </th>
              <th className="text-left text-xs text-zinc-500 font-medium px-5 py-3">
                Category
              </th>
              <th className="text-right text-xs text-zinc-500 font-medium px-5 py-3">
                Amount
              </th>
              <th className="text-right text-xs text-zinc-500 font-medium px-5 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((transaction) => {
              const category = categoryMap.get(transaction.categoryId);

              return (
                <tr
                  key={transaction.id}
                  className="border-b border-border/50 transition-colors hover:bg-secondary/40"
                >
                  <td className="px-5 py-3 text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-5 py-3 text-sm text-foreground">
                    {transaction.description}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg"
                      style={{
                        backgroundColor: (category?.color ?? "#64748b") + "20",
                        color: category?.color ?? "#64748b",
                      }}
                    >
                      {category?.icon} {category?.name ?? "Unknown"}
                    </span>
                  </td>
                  <td
                    className={`px-5 py-3 text-sm font-medium text-right whitespace-nowrap ${
                      transaction.type === "income"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(transaction)}
                      className="text-muted-foreground hover:text-emerald-400"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(transaction.id)}
                      className="text-muted-foreground hover:text-red-400"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
        {sorted.length} transaction{sorted.length !== 1 ? "s" : ""}
      </div>
    </Card>
  );
}
