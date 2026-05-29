"use client";

import { useState } from "react";
import type { SavingsGoal } from "@/types";

interface GoalFormProps {
  initialData?: SavingsGoal;
  onSubmit: (data: Omit<SavingsGoal, "id" | "createdAt">) => void;
  onCancel: () => void;
}

const PRESET_COLORS = [
  "#22c55e", "#14b8a6", "#06b6d4", "#3b82f6", "#6366f1",
  "#8b5cf6", "#ec4899", "#f43f5e", "#f97316", "#eab308",
];

const PRESET_ICONS = [
  "🛟", "💻", "🏝️", "🚗", "🏠", "✈️", "💍", "🎓",
  "📱", "🎮", "🚲", "🎁", "💰", "🏆", "⛵", "🐶",
];

export default function GoalForm({ initialData, onSubmit, onCancel }: GoalFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [targetAmount, setTargetAmount] = useState(
    initialData?.targetAmount?.toString() ?? ""
  );
  const [currentAmount, setCurrentAmount] = useState(
    initialData?.currentAmount?.toString() ?? "0"
  );
  const [deadline, setDeadline] = useState(initialData?.deadline ?? "");
  const [color, setColor] = useState(initialData?.color ?? PRESET_COLORS[0]);
  const [icon, setIcon] = useState(initialData?.icon ?? PRESET_ICONS[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Enter a goal name";
    const target = parseFloat(targetAmount);
    if (!targetAmount || isNaN(target) || target <= 0)
      errs.targetAmount = "Enter a target above 0";
    const current = parseFloat(currentAmount);
    if (currentAmount === "" || isNaN(current) || current < 0)
      errs.currentAmount = "Enter a valid amount";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      deadline: deadline || undefined,
      color,
      icon,
    });
  };

  const inputClass =
    "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs text-zinc-400 mb-1.5">Goal name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Dream Vacation"
          className={inputClass}
        />
        {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">Target</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="0.00"
            className={inputClass}
          />
          {errors.targetAmount && (
            <p className="text-xs text-red-400 mt-1">{errors.targetAmount}</p>
          )}
        </div>
        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">Saved so far</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            placeholder="0.00"
            className={inputClass}
          />
          {errors.currentAmount && (
            <p className="text-xs text-red-400 mt-1">{errors.currentAmount}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs text-zinc-400 mb-1.5">
          Target date (optional)
        </label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className={inputClass}
        />
      </div>

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

      <div>
        <label className="block text-xs text-zinc-400 mb-1.5">Color</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full transition-all ${
                color === c
                  ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-110"
                  : ""
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
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
          {initialData ? "Update" : "Create"} Goal
        </button>
      </div>
    </form>
  );
}
