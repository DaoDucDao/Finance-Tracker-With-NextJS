"use client";

import { useEffect, useMemo, useState } from "react";
import { useGoals } from "@/hooks/useGoals";
import GoalCard from "@/components/goals/GoalCard";
import GoalForm from "@/components/goals/GoalForm";
import ContributeForm from "@/components/goals/ContributeForm";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Confetti from "@/components/ui/Confetti";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import type { SavingsGoal } from "@/types";

export default function GoalsPage() {
  const {
    goals,
    isLoaded,
    addGoal,
    updateGoal,
    deleteGoal,
    contribute,
    initSeedData,
  } = useGoals();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SavingsGoal | undefined>();
  const [contributing, setContributing] = useState<SavingsGoal | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  useEffect(() => {
    if (isLoaded) initSeedData();
  }, [isLoaded, initSeedData]);

  const summary = useMemo(() => {
    const saved = goals.reduce((s, g) => s + g.currentAmount, 0);
    const target = goals.reduce((s, g) => s + g.targetAmount, 0);
    const reached = goals.filter((g) => g.currentAmount >= g.targetAmount).length;
    return { saved, target, reached };
  }, [goals]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <Confetti trigger={confettiTrigger} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Savings Goals</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {summary.reached} of {goals.length} goals reached ·{" "}
            {formatCurrency(summary.saved)} saved
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(undefined);
            setShowForm(true);
          }}
        >
          + New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-4xl">🏆</p>
          <p className="mt-3 text-muted-foreground">No goals yet</p>
          <p className="text-sm text-muted-foreground/70">
            Set a savings goal and watch your progress grow.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              onContribute={(goal) => setContributing(goal)}
              onEdit={(goal) => {
                setEditing(goal);
                setShowForm(true);
              }}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      )}

      {/* Add / edit goal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "Edit Goal" : "New Savings Goal"}
      >
        <GoalForm
          initialData={editing}
          onSubmit={(data) => {
            if (editing) {
              const wasComplete = editing.currentAmount >= editing.targetAmount;
              updateGoal(editing.id, data);
              if (!wasComplete && data.currentAmount >= data.targetAmount) {
                setConfettiTrigger((t) => t + 1);
              }
            } else {
              addGoal(data);
              if (data.currentAmount >= data.targetAmount) {
                setConfettiTrigger((t) => t + 1);
              }
            }
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      {/* Contribute */}
      <Modal
        isOpen={!!contributing}
        onClose={() => setContributing(undefined)}
        title="Add Funds"
      >
        {contributing && (
          <ContributeForm
            goal={contributing}
            onSubmit={(amount) => {
              const wasComplete =
                contributing.currentAmount >= contributing.targetAmount;
              contribute(contributing.id, amount);
              if (
                !wasComplete &&
                contributing.currentAmount + amount >= contributing.targetAmount
              ) {
                setConfettiTrigger((t) => t + 1);
              }
              setContributing(undefined);
            }}
            onCancel={() => setContributing(undefined)}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteGoal(deleteId);
        }}
        title="Delete Goal"
        message="Are you sure you want to delete this savings goal?"
      />
    </div>
  );
}
