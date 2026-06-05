"use client";

import { useState } from "react";
import type { SavingsGoal } from "@/types";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import IconPicker from "@/components/ui/IconPicker";
import ColorPicker from "@/components/ui/ColorPicker";

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
    const validationErrors: Record<string, string> = {};
    const parsedTarget = parseFloat(targetAmount);
    const parsedCurrent = parseFloat(currentAmount);

    if (!name.trim()) validationErrors.name = "Enter a goal name";
    if (!targetAmount || isNaN(parsedTarget) || parsedTarget <= 0)
      validationErrors.targetAmount = "Enter a target above 0";
    if (currentAmount === "" || isNaN(parsedCurrent) || parsedCurrent < 0)
      validationErrors.currentAmount = "Enter a valid amount";

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Goal name</Label>
        <Input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Dream Vacation"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Target</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={targetAmount}
            onChange={(event) => setTargetAmount(event.target.value)}
            placeholder="0.00"
          />
          {errors.targetAmount && (
            <p className="mt-1 text-xs text-destructive">{errors.targetAmount}</p>
          )}
        </div>
        <div>
          <Label>Saved so far</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={currentAmount}
            onChange={(event) => setCurrentAmount(event.target.value)}
            placeholder="0.00"
          />
          {errors.currentAmount && (
            <p className="mt-1 text-xs text-destructive">{errors.currentAmount}</p>
          )}
        </div>
      </div>

      <div>
        <Label>Target date (optional)</Label>
        <Input
          type="date"
          value={deadline}
          onChange={(event) => setDeadline(event.target.value)}
        />
      </div>

      <div>
        <Label>Icon</Label>
        <IconPicker icons={PRESET_ICONS} selected={icon} onSelect={setIcon} />
      </div>

      <div>
        <Label>Color</Label>
        <ColorPicker colors={PRESET_COLORS} selected={color} onSelect={setColor} />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Update" : "Create"} Goal</Button>
      </div>
    </form>
  );
}
