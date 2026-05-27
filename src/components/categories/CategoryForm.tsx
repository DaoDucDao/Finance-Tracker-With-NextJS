"use client";

import { useState } from "react";
import type { Category, TransactionType } from "@/types";

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
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Enter a category name";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ name: name.trim(), type, color, icon });
  };

  const inputClass =
    "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type */}
      <div className="flex gap-2">
        {(["expense", "income"] as TransactionType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              type === t
                ? t === "income"
                  ? "bg-emerald-600 text-white"
                  : "bg-red-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {t === "income" ? "Income" : "Expense"}
          </button>
        ))}
      </div>

      {/* Name */}
      <div>
        <label className="block text-xs text-zinc-400 mb-1.5">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className={inputClass}
        />
        {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
      </div>

      {/* Icon */}
      <div>
        <label className="block text-xs text-zinc-400 mb-1.5">Icon</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_ICONS.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIcon(i)}
              className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${
                icon === i
                  ? "bg-zinc-600 ring-2 ring-emerald-500"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="block text-xs text-zinc-400 mb-1.5">Color</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full transition-all ${
                color === c ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-110" : ""
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-zinc-800 rounded-xl p-4 flex items-center gap-3">
        <span
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          style={{ backgroundColor: color + "20" }}
        >
          {icon}
        </span>
        <div>
          <p className="text-sm text-zinc-200 font-medium">{name || "Category name"}</p>
          <p className="text-xs text-zinc-500 capitalize">{type}</p>
        </div>
        <div className="ml-auto w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
      </div>

      {/* Actions */}
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
          {initialData ? "Update" : "Add"} Category
        </button>
      </div>
    </form>
  );
}
