type TransactionType = "income" | "expense";

interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
}

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  description: string;
  date: string; // ISO date string
  createdAt: string;
}

interface MonthlyStats {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

interface Budget {
  id: string;
  categoryId: string;
  amount: number; // monthly spending limit
  createdAt: string;
}

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  color: string;
  icon: string;
  deadline?: string; // ISO date string
  createdAt: string;
}

type Theme = "dark" | "light";

interface BackupData {
  version: number;
  exportedAt: string;
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  goals: SavingsGoal[];
}

export type {
  TransactionType,
  Category,
  Transaction,
  MonthlyStats,
  Budget,
  SavingsGoal,
  Theme,
  BackupData,
};
