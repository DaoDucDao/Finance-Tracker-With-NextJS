"use client";

import type { Budget, Category } from "@/types";
import { formatCurrency } from "@/utils/format";

interface BudgetCardProps {
  budget: Budget;
  category: Category | undefined;
  spent: number;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

export default function BudgetCard({
  budget,
  category,
  spent,
  onEdit,
  onDelete,
}: BudgetCardProps) {
  const pct = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
  const clamped = Math.min(pct, 100);
  const remaining = budget.amount - spent;
  const over = spent > budget.amount;
  const warning = pct >= 80 && !over;

  const barColor = over
    ? "from-red-500 to-rose-600"
    : warning
    ? "from-amber-400 to-orange-500"
    : "from-emerald-400 to-emerald-600";

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-zinc-900 p-5 transition-all hover:scale-[1.02] hover:shadow-xl ${
        over
          ? "border-red-600/50 shadow-red-900/20 animate-budget-glow"
          : "border-zinc-800"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
            style={{ backgroundColor: (category?.color ?? "#64748b") + "20" }}
          >
            {category?.icon ?? "📦"}
          </span>
          <div>
            <p className="text-sm font-semibold text-white">
              {category?.name ?? "Unknown category"}
            </p>
            <p className="text-xs text-zinc-500">
              {formatCurrency(budget.amount)} / month
            </p>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(budget)}
            className="rounded-lg px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(budget.id)}
            className="rounded-lg px-2 py-1 text-xs text-red-400 hover:bg-red-600/10"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mb-2 flex items-end justify-between">
        <span className="text-lg font-bold text-white">{formatCurrency(spent)}</span>
        <span
          className={`text-xs font-medium ${
            over ? "text-red-400" : warning ? "text-amber-400" : "text-emerald-400"
          }`}
        >
          {Math.round(pct)}%
        </span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>

      <p
        className={`mt-2 text-xs ${
          over ? "text-red-400 font-medium" : "text-zinc-500"
        }`}
      >
        {over
          ? `⚠️ ${formatCurrency(Math.abs(remaining))} over budget`
          : `${formatCurrency(remaining)} remaining`}
      </p>
    </div>
  );
}
