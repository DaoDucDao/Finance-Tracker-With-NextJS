"use client";

import { useState } from "react";
import type { Budget, Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Category</Label>
        <Select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {available.length === 0 && <option value="">No categories left</option>}
          {available.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </Select>
        {errors.categoryId && (
          <p className="mt-1 text-xs text-destructive">{errors.categoryId}</p>
        )}
      </div>

      <div>
        <Label>Monthly limit</Label>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
        />
        {errors.amount && (
          <p className="mt-1 text-xs text-destructive">{errors.amount}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Update" : "Add"} Budget</Button>
      </div>
    </form>
  );
}
