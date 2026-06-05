"use client";

import { useState } from "react";
import type { SavingsGoal } from "@/types";
import { formatCurrency } from "@/utils/format";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const parsedAmount = parseFloat(amount);

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Enter an amount above 0");
      return;
    }

    onSubmit(parsedAmount);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl bg-secondary/50 p-4 text-center">
        <span className="text-2xl">{goal.icon}</span>
        <p className="mt-1 text-sm font-medium text-foreground">{goal.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatCurrency(remaining)} left to reach goal
        </p>
      </div>

      <div>
        <Label>Amount to add</Label>
        <Input
          type="number"
          step="0.01"
          min="0"
          autoFocus
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
            setError("");
          }}
          placeholder="0.00"
        />
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK_AMOUNTS.map((quickAmount) => (
          <Button
            key={quickAmount}
            variant="secondary"
            size="sm"
            onClick={() => setAmount(quickAmount.toString())}
          >
            +{formatCurrency(quickAmount)}
          </Button>
        ))}
        {remaining > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setAmount(remaining.toString())}
            className="bg-primary/15 text-primary hover:bg-primary/25"
          >
            Fill it up
          </Button>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add funds</Button>
      </div>
    </form>
  );
}
