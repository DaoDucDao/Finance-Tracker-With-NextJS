"use client";

import { useState } from "react";
import type { Budget, Category } from "@/types";

interface BudgetFormProps {
  categories: Category[];
  usedCategoryIds: string[];
  initialData?: Budget;
  onSubmit: (data: Omit<Budget, "id" | "createdAt">) => void;
  onCancel: () => void;
}

export default function BudgetForm({
  categories,
  usedCategoryIds,
  initialData,
  onSubmit,
  onCancel,
}: BudgetFormProps) {
  const expenseCategories = categories.filter((c) => c.type === "expense");
  const available = expenseCategories.filter(
    (c) => c.id === initialData?.categoryId || !usedCategoryIds.includes(c.id)
  );

  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId ?? available[0]?.id ?? ""
  );
  const [amount, setAmount] = useState(initialData?.amount?.toString() ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!categoryId) errs.categoryId = "Pick a category";
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) errs.amount = "Enter an amount above 0";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ categoryId, amount: parseFloat(amount) });
  };

  const inputClass =
    "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs text-zinc-400 mb-1.5">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={inputClass}
        >
          {available.length === 0 && <option value="">No categories left</option>}
          {available.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-xs text-red-400 mt-1">{errors.categoryId}</p>
        )}
      </div>

      <div>
        <label className="block text-xs text-zinc-400 mb-1.5">
          Monthly limit
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className={inputClass}
        />
        {errors.amount && <p className="text-xs text-red-400 mt-1">{errors.amount}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl bg-zinc-700 text-zinc-300 text-sm hover:bg-zinc-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition-colors"
        >
          {initialData ? "Update" : "Add"} Budget
        </button>
      </div>
    </form>
  );
}
