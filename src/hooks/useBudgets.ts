"use client";

import { useCallback } from "react";
import { v4 as uuid } from "uuid";
import type { Budget } from "@/types";
import { useLocalStorage } from "./useLocalStorage";
import { generateSeedBudgets } from "@/utils/seed";

const useBudgets = () => {
  const [budgets, setBudgets, isLoaded] = useLocalStorage<Budget[]>(
    "finance-budgets",
    []
  );

  const initSeedData = useCallback(() => {
    if (isLoaded && budgets.length === 0) setBudgets(generateSeedBudgets());
  }, [isLoaded, budgets.length, setBudgets]);

  const addBudget = useCallback(
    (data: Omit<Budget, "id" | "createdAt">) => {
      const newBudget: Budget = {
        ...data,
        id: uuid(),
        createdAt: new Date().toISOString(),
      };

      setBudgets((prev) => [...prev, newBudget]);
    },
    [setBudgets]
  );

  const updateBudget = useCallback(
    (id: string, data: Partial<Omit<Budget, "id" | "createdAt">>) => {
      setBudgets((prev) =>
        prev.map((budget) => (budget.id === id ? { ...budget, ...data } : budget))
      );
    },
    [setBudgets]
  );

  const deleteBudget = useCallback(
    (id: string) => {
      setBudgets((prev) => prev.filter((budget) => budget.id !== id));
    },
    [setBudgets]
  );

  return {
    budgets,
    isLoaded,
    addBudget,
    updateBudget,
    deleteBudget,
    initSeedData,
  };
};

export { useBudgets };
