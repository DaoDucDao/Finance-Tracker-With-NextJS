export type TransactionType = "income" | "expense";

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  description: string;
  date: string; // ISO date string
  createdAt: string;
}

export interface MonthlyStats {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number; // monthly spending limit
  createdAt: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  color: string;
  icon: string;
  deadline?: string; // ISO date string
  createdAt: string;
}

export type Theme = "dark" | "light";

export interface BackupData {
  version: number;
  exportedAt: string;
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  goals: SavingsGoal[];
}
