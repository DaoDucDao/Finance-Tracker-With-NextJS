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
  const expenseCategories = categories.filter(
    (category) => category.type === "expense"
  );
  const available = expenseCategories.filter(
    (category) =>
      category.id === initialData?.categoryId ||
      !usedCategoryIds.includes(category.id)
  );

  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId ?? available[0]?.id ?? ""
  );
  const [amount, setAmount] = useState(initialData?.amount?.toString() ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const validationErrors: Record<string, string> = {};
    const parsedAmount = parseFloat(amount);

    if (!categoryId) validationErrors.categoryId = "Pick a category";
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0)
      validationErrors.amount = "Enter an amount above 0";

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({ categoryId, amount: parseFloat(amount) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Category</Label>
        <Select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
        >
          {available.length === 0 && <option value="">No categories left</option>}
          {available.map((category) => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
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
          onChange={(event) => setAmount(event.target.value)}
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
