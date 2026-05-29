"use client";

import { useCallback } from "react";
import { v4 as uuid } from "uuid";
import type { SavingsGoal } from "@/types";
import { useLocalStorage } from "./useLocalStorage";
import { generateSeedGoals } from "@/utils/seed";

export function useGoals() {
  const [goals, setGoals, isLoaded] = useLocalStorage<SavingsGoal[]>(
    "finance-goals",
    []
  );

  const initSeedData = useCallback(() => {
    if (isLoaded && goals.length === 0) {
      setGoals(generateSeedGoals());
    }
  }, [isLoaded, goals.length, setGoals]);

  const addGoal = useCallback(
    (data: Omit<SavingsGoal, "id" | "createdAt">) => {
      const newGoal: SavingsGoal = {
        ...data,
        id: uuid(),
        createdAt: new Date().toISOString(),
      };
      setGoals((prev) => [...prev, newGoal]);
    },
    [setGoals]
  );

  const updateGoal = useCallback(
    (id: string, data: Partial<Omit<SavingsGoal, "id" | "createdAt">>) => {
      setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...data } : g)));
    },
    [setGoals]
  );

  const deleteGoal = useCallback(
    (id: string) => {
      setGoals((prev) => prev.filter((g) => g.id !== id));
    },
    [setGoals]
  );

  const contribute = useCallback(
    (id: string, amount: number) => {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === id
            ? { ...g, currentAmount: Math.max(0, g.currentAmount + amount) }
            : g
        )
      );
    },
    [setGoals]
  );

  return {
    goals,
    isLoaded,
    addGoal,
    updateGoal,
    deleteGoal,
    contribute,
    initSeedData,
  };
}
