"use client";

import type { TransactionType, Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

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
  const filteredCategories = type ? categories.filter((c) => c.type === type) : categories;

  return (
    <div className="flex flex-wrap gap-3">
      <Input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search descriptions..."
        className="min-w-[200px] flex-1"
      />

      <Select
        value={type}
        onChange={(e) => onTypeChange(e.target.value as TransactionType | "")}
        className="w-auto"
      >
        <option value="">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </Select>

      <Select
        value={categoryId}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-auto"
      >
        <option value="">All categories</option>
        {filteredCategories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.icon} {c.name}
          </option>
        ))}
      </Select>

      <Select
        value={month}
        onChange={(e) => onMonthChange(e.target.value)}
        className="w-auto"
      >
        <option value="">All months</option>
        {months.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </Select>

      {(search || type || categoryId || month) && (
        <Button
          variant="secondary"
          onClick={() => {
            onSearchChange("");
            onTypeChange("");
            onCategoryChange("");
            onMonthChange("");
          }}
        >
          Clear
        </Button>
      )}
    </div>
  );
}
