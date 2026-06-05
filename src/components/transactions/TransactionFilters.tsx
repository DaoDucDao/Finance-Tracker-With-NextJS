"use client";

import type { TransactionType, Category } from "@/types";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";

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
  const filteredCategories = type
    ? categories.filter((category) => category.type === type)
    : categories;

  return (
    <div className="flex flex-wrap gap-3">
      <Input
        type="text"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search descriptions..."
        className="min-w-[200px] flex-1"
      />

      <Select
        value={type}
        onChange={(event) =>
          onTypeChange(event.target.value as TransactionType | "")
        }
        className="w-auto"
      >
        <option value="">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </Select>

      <Select
        value={categoryId}
        onChange={(event) => onCategoryChange(event.target.value)}
        className="w-auto"
      >
        <option value="">All categories</option>
        {filteredCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.icon} {category.name}
          </option>
        ))}
      </Select>

      <Select
        value={month}
        onChange={(event) => onMonthChange(event.target.value)}
        className="w-auto"
      >
        <option value="">All months</option>
        {months.map((monthKey) => (
          <option key={monthKey} value={monthKey}>
            {monthKey}
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
