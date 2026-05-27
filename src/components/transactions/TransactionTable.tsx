"use client";

import type { Transaction, Category } from "@/types";
import { formatCurrency, formatDate } from "@/utils/format";

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
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sorted.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
        <p className="text-zinc-500">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
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
            {sorted.map((t) => {
              const cat = categoryMap.get(t.categoryId);
              return (
                <tr
                  key={t.id}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-5 py-3 text-sm text-zinc-400 whitespace-nowrap">
                    {formatDate(t.date)}
                  </td>
                  <td className="px-5 py-3 text-sm text-zinc-200">{t.description}</td>
                  <td className="px-5 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg"
                      style={{
                        backgroundColor: (cat?.color ?? "#64748b") + "20",
                        color: cat?.color ?? "#64748b",
                      }}
                    >
                      {cat?.icon} {cat?.name ?? "Unknown"}
                    </span>
                  </td>
                  <td
                    className={`px-5 py-3 text-sm font-medium text-right whitespace-nowrap ${
                      t.type === "income" ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {formatCurrency(t.amount)}
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => onEdit(t)}
                      className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(t.id)}
                      className="text-xs text-zinc-400 hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-zinc-800 text-xs text-zinc-500">
        {sorted.length} transaction{sorted.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
