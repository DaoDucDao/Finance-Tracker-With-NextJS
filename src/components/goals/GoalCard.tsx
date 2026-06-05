"use client";

import type { SavingsGoal } from "@/types";
import { daysUntil, formatCurrency, formatDate } from "@/utils/format";
import Button from "@/components/ui/button";

interface GoalCardProps {
  goal: SavingsGoal;
  onContribute: (goal: SavingsGoal) => void;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (id: string) => void;
}

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function GoalCard({
  goal,
  onContribute,
  onEdit,
  onDelete,
}: GoalCardProps) {
  const percent =
    goal.targetAmount > 0
      ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
      : 0;
  const complete = goal.currentAmount >= goal.targetAmount;
  const dashOffset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

  const daysLeft = goal.deadline ? daysUntil(goal.deadline) : null;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-zinc-900 p-6 transition-all hover:scale-[1.02] hover:shadow-xl ${
        complete
          ? "border-emerald-500/50 shadow-emerald-900/30"
          : "border-zinc-800"
      }`}
    >
      {complete && (
        <span className="absolute right-4 top-4 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-400">
          ✓ Reached!
        </span>
      )}

      <div className="flex flex-col items-center text-center">
        {/* Progress ring */}
        <div className="relative h-32 w-32">
          <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              stroke="var(--secondary)"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              stroke={goal.color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl">{goal.icon}</span>
            <span className="mt-0.5 text-sm font-bold text-white">
              {Math.round(percent)}%
            </span>
          </div>
        </div>

        <p className="mt-4 text-base font-semibold text-white">{goal.name}</p>
        <p className="mt-1 text-sm text-zinc-400">
          {formatCurrency(goal.currentAmount)}{" "}
          <span className="text-zinc-600">of {formatCurrency(goal.targetAmount)}</span>
        </p>

        {goal.deadline && (
          <p
            className={`mt-1 text-xs ${
              daysLeft !== null && daysLeft < 0
                ? "text-red-400"
                : daysLeft !== null && daysLeft <= 30
                ? "text-amber-400"
                : "text-zinc-500"
            }`}
          >
            {daysLeft !== null && daysLeft < 0
              ? `Overdue · ${formatDate(goal.deadline)}`
              : `${daysLeft} days left · ${formatDate(goal.deadline)}`}
          </p>
        )}
      </div>

      <div className="mt-5 flex gap-2">
        <Button
          onClick={() => onContribute(goal)}
          disabled={complete}
          className="flex-1"
        >
          + Add funds
        </Button>
        <Button variant="secondary" onClick={() => onEdit(goal)}>
          Edit
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => onDelete(goal.id)}
          className="text-red-400 hover:bg-red-600/10 hover:text-red-400"
        >
          ✕
        </Button>
      </div>
    </div>
  );
}
