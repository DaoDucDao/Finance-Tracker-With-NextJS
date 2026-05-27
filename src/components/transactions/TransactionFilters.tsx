"use client";

import type { TransactionType, Category } from "@/types";

interface TransactionFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  type: TransactionType | "";
  onTypeChange: (value: TransactionType | "") => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  month: string;
  onMonthChange: (value: string) => void;
  categories: Category[];
  months: string[];
}

export default function TransactionFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
  categoryId,
  onCategoryChange,
  month,
  onMonthChange,
  categories,
  months,
}: TransactionFiltersProps) {
  const inputClass =
    "bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all";

  const filteredCategories = type ? categories.filter((c) => c.type === type) : categories;

  return (
    <div className="flex flex-wrap gap-3">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search descriptions..."
        className={`${inputClass} flex-1 min-w-[200px]`}
      />

      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value as TransactionType | "")}
        className={inputClass}
      >
        <option value="">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select
        value={categoryId}
        onChange={(e) => onCategoryChange(e.target.value)}
        className={inputClass}
      >
        <option value="">All categories</option>
        {filteredCategories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.icon} {c.name}
          </option>
        ))}
      </select>

      <select
        value={month}
        onChange={(e) => onMonthChange(e.target.value)}
        className={inputClass}
      >
        <option value="">All months</option>
        {months.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      {(search || type || categoryId || month) && (
        <button
          onClick={() => {
            onSearchChange("");
            onTypeChange("");
            onCategoryChange("");
            onMonthChange("");
          }}
          className="px-3 py-2 rounded-xl bg-zinc-700 text-zinc-400 text-sm hover:bg-zinc-600 transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}
