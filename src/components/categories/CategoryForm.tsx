"use client";

import { useState } from "react";
import type { Category, TransactionType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: Omit<Category, "id">) => void;
  onCancel: () => void;
}

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899",
];

const PRESET_ICONS = [
  "💰", "💳", "🏠", "🚗", "🍔", "🛍️", "📋", "🏥",
  "🎬", "📚", "✈️", "⚽", "🎮", "💼", "📱", "🎁",
];

export default function CategoryForm({ initialData, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [type, setType] = useState<TransactionType>(initialData?.type ?? "expense");
  const [color, setColor] = useState(initialData?.color ?? PRESET_COLORS[0]);
  const [icon, setIcon] = useState(initialData?.icon ?? PRESET_ICONS[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const validationErrors: Record<string, string> = {};

    if (!name.trim()) validationErrors.name = "Enter a category name";

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({ name: name.trim(), type, color, icon });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type */}
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-secondary/50 p-1">
        {(["expense", "income"] as TransactionType[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setType(option)}
            className={`rounded-lg py-2 text-sm font-medium transition-all ${
              type === option
                ? option === "income"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-red-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {option === "income" ? "Income" : "Expense"}
          </button>
        ))}
      </div>

      {/* Name */}
      <div>
        <Label>Name</Label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-destructive">{errors.name}</p>
        )}
      </div>

      {/* Icon */}
      <div>
        <Label>Icon</Label>
        <div className="flex flex-wrap gap-2">
          {PRESET_ICONS.map((iconOption) => (
            <button
              key={iconOption}
              type="button"
              onClick={() => setIcon(iconOption)}
              className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${
                icon === iconOption
                  ? "bg-zinc-600 ring-2 ring-emerald-500"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              {iconOption}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((colorOption) => (
            <button
              key={colorOption}
              type="button"
              onClick={() => setColor(colorOption)}
              className={`w-8 h-8 rounded-full transition-all ${
                color === colorOption
                  ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-110"
                  : ""
              }`}
              style={{ backgroundColor: colorOption }}
            />
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="flex items-center gap-3 rounded-xl bg-secondary/50 p-4">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
          style={{ backgroundColor: color + "20" }}
        >
          {icon}
        </span>
        <div>
          <p className="text-sm font-medium text-foreground">
            {name || "Category name"}
          </p>
          <p className="text-xs capitalize text-muted-foreground">{type}</p>
        </div>
        <div
          className="ml-auto h-4 w-4 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Update" : "Add"} Category</Button>
      </div>
    </form>
  );
}
