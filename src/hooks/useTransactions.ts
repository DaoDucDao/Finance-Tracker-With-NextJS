"use client";

import { useCallback, useMemo } from "react";
import { v4 as uuid } from "uuid";
import type { Transaction, TransactionType } from "@/types";
import { useLocalStorage } from "./useLocalStorage";
import { generateSeedTransactions } from "@/utils/seed";
import { getMonthKey } from "@/utils/format";

const useTransactions = () => {
  const [transactions, setTransactions, isLoaded] = useLocalStorage<Transaction[]>(
    "finance-transactions",
    []
  );

  const initSeedData = useCallback(() => {
    if (transactions.length === 0 && isLoaded)
      setTransactions(generateSeedTransactions());
  }, [transactions.length, isLoaded, setTransactions]);

  const addTransaction = useCallback(
    (data: Omit<Transaction, "id" | "createdAt">) => {
      const newTransaction: Transaction = {
        ...data,
        id: uuid(),
        createdAt: new Date().toISOString(),
      };

      setTransactions((prev) => [newTransaction, ...prev]);
    },
    [setTransactions]
  );

  const updateTransaction = useCallback(
    (id: string, data: Partial<Omit<Transaction, "id" | "createdAt">>) => {
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === id ? { ...transaction, ...data } : transaction
        )
      );
    },
    [setTransactions]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      setTransactions((prev) =>
        prev.filter((transaction) => transaction.id !== id)
      );
    },
    [setTransactions]
  );

  const getFiltered = useCallback(
    (filters: {
      type?: TransactionType;
      categoryId?: string;
      month?: string;
      search?: string;
    }) =>
      transactions.filter((transaction) => {
        if (filters.type && transaction.type !== filters.type) return false;
        if (filters.categoryId && transaction.categoryId !== filters.categoryId)
          return false;
        if (filters.month && getMonthKey(transaction.date) !== filters.month)
          return false;
        if (
          filters.search &&
          !transaction.description
            .toLowerCase()
            .includes(filters.search.toLowerCase())
        )
          return false;

        return true;
      }),
    [transactions]
  );

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalExpense = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      count: transactions.length,
    };
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>();

    transactions.forEach((transaction) => {
      const key = getMonthKey(transaction.date);
      const entry = map.get(key) ?? { income: 0, expense: 0 };

      if (transaction.type === "income") entry.income += transaction.amount;
      else entry.expense += transaction.amount;
      map.set(key, entry);
    });

    return Array.from(map.entries())
      .sort(([firstMonth], [secondMonth]) =>
        firstMonth.localeCompare(secondMonth)
      )
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
};

export { useTransactions };
