"use client";

import Link from "next/link";
import type { SavingsGoal } from "@/types";
import { formatCurrency } from "@/utils/format";
import { Card } from "@/components/ui/card";

interface GoalsSnapshotProps {
  goals: SavingsGoal[];
}

export default function GoalsSnapshot({ goals }: GoalsSnapshotProps) {
  const top = [...goals]
    .map((goal) => ({
      ...goal,
      percent:
        goal.targetAmount > 0
          ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
          : 0,
    }))
    .sort((first, second) => second.percent - first.percent)
    .slice(0, 4);

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Savings goals</h3>
        <Link
          href="/goals"
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/10 hover:text-emerald-300"
        >
          View all →
        </Link>
      </div>

      {top.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">No goals yet.</p>
      ) : (
        <div className="space-y-4">
          {top.map((goal) => (
            <div key={goal.id}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-zinc-300">
                  <span>{goal.icon}</span>
                  {goal.name}
                </span>
                <span className="text-zinc-500">
                  {formatCurrency(goal.currentAmount)} /{" "}
                  {formatCurrency(goal.targetAmount)}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${goal.percent}%`,
                    backgroundColor: goal.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
