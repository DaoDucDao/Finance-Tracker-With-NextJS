"use client";

import { useState } from "react";
import type { SavingsGoal } from "@/types";
import { formatCurrency } from "@/utils/format";

interface ContributeFormProps {
  goal: SavingsGoal;
  onSubmit: (amount: number) => void;
  onCancel: () => void;
}

const QUICK_AMOUNTS = [25, 50, 100, 250];

export default function ContributeForm({
  goal,
  onSubmit,
  onCancel,
}: ContributeFormProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setError("Enter an amount above 0");
      return;
    }
    onSubmit(num);
  };

  const inputClass =
    "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl bg-zinc-800 p-4 text-center">
        <span className="text-2xl">{goal.icon}</span>
        <p className="mt-1 text-sm font-medium text-zinc-200">{goal.name}</p>
        <p className="text-xs text-zinc-500">
          {formatCurrency(remaining)} left to reach goal
        </p>
      </div>

      <div>
        <label className="block text-xs text-zinc-400 mb-1.5">Amount to add</label>
        <input
          type="number"
          step="0.01"
          min="0"
          autoFocus
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError("");
          }}
          placeholder="0.00"
          className={inputClass}
        />
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK_AMOUNTS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => setAmount(q.toString())}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            +{formatCurrency(q)}
          </button>
        ))}
        {remaining > 0 && (
          <button
            type="button"
            onClick={() => setAmount(remaining.toString())}
            className="rounded-lg bg-emerald-600/20 px-3 py-1.5 text-sm text-emerald-400 hover:bg-emerald-600/30 transition-colors"
          >
            Fill it up
          </button>
        )}
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
          Add funds
        </button>
      </div>
    </form>
  );
}
