"use client";

import { useCallback, useMemo } from "react";
import { v4 as uuid } from "uuid";
import type { Transaction, TransactionType } from "@/types";
import { useLocalStorage } from "./useLocalStorage";
import { generateSeedTransactions } from "@/utils/seed";
import { getMonthKey } from "@/utils/format";

export function useTransactions() {
  const [transactions, setTransactions, isLoaded] = useLocalStorage<Transaction[]>(
    "finance-transactions",
    []
  );

  const initSeedData = useCallback(() => {
    if (transactions.length === 0 && isLoaded) {
      setTransactions(generateSeedTransactions());
    }
  }, [transactions.length, isLoaded, setTransactions]);

  const addTransaction = useCallback(
    (data: Omit<Transaction, "id" | "createdAt">) => {
      const newTx: Transaction = {
        ...data,
        id: uuid(),
        createdAt: new Date().toISOString(),
      };
      setTransactions((prev) => [newTx, ...prev]);
    },
    [setTransactions]
  );

  const updateTransaction = useCallback(
    (id: string, data: Partial<Omit<Transaction, "id" | "createdAt">>) => {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data } : t))
      );
    },
    [setTransactions]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    },
    [setTransactions]
  );

  const getFiltered = useCallback(
    (filters: {
      type?: TransactionType;
      categoryId?: string;
      month?: string;
      search?: string;
    }) => {
      return transactions.filter((t) => {
        if (filters.type && t.type !== filters.type) return false;
        if (filters.categoryId && t.categoryId !== filters.categoryId) return false;
        if (filters.month && getMonthKey(t.date) !== filters.month) return false;
        if (
          filters.search &&
          !t.description.toLowerCase().includes(filters.search.toLowerCase())
        )
          return false;
        return true;
      });
    },
    [transactions]
  );

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      count: transactions.length,
    };
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>();
    transactions.forEach((t) => {
      const key = getMonthKey(t.date);
      const entry = map.get(key) ?? { income: 0, expense: 0 };
      if (t.type === "income") entry.income += t.amount;
      else entry.expense += t.amount;
      map.set(key, entry);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        ...data,
        balance: data.income - data.expense,
      }));
  }, [transactions]);

  return {
    transactions,
    isLoaded,
    stats,
    monthlyData,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getFiltered,
    initSeedData,
  };
}
