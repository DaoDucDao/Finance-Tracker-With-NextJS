"use client";

import { useState, useEffect } from "react";
import type { Transaction, TransactionType, Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TransactionFormProps {
  categories: Category[];
  initialData?: Transaction;
  onSubmit: (data: Omit<Transaction, "id" | "createdAt">) => void;
  onCancel: () => void;
}

export default function TransactionForm({
  categories,
  initialData,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(initialData?.type ?? "expense");
  const [amount, setAmount] = useState(initialData?.amount.toString() ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [date, setDate] = useState(
    initialData?.date ?? new Date().toISOString().split("T")[0]
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredCategories = categories.filter((c) => c.type === type);

  useEffect(() => {
    if (!filteredCategories.find((c) => c.id === categoryId)) {
      setCategoryId(filteredCategories[0]?.id ?? "");
    }
  }, [type, filteredCategories, categoryId]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      errs.amount = "Enter a valid amount";
    if (!categoryId) errs.categoryId = "Select a category";
    if (!description.trim()) errs.description = "Enter a description";
    if (!date) errs.date = "Select a date";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      type,
      amount: Number(amount),
      categoryId,
      description: description.trim(),
      date,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type toggle */}
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-secondary/50 p-1">
        {(["expense", "income"] as TransactionType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`rounded-lg py-2 text-sm font-medium transition-all ${
              type === t
                ? t === "income"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-red-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "income" ? "Income" : "Expense"}
          </button>
        ))}
      </div>

      {/* Amount */}
      <div>
        <Label>Amount ($)</Label>
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

      {/* Category */}
      <div>
        <Label>Category</Label>
        <Select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Select category</option>
          {filteredCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </Select>
        {errors.categoryId && (
          <p className="mt-1 text-xs text-destructive">{errors.categoryId}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <Input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What was this for?"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-destructive">{errors.description}</p>
        )}
      </div>

      {/* Date */}
      <div>
        <Label>Date</Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {errors.date && (
          <p className="mt-1 text-xs text-destructive">{errors.date}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? "Update" : "Add"} Transaction
        </Button>
      </div>
    </form>
  );
}
