import { v4 as uuid } from "uuid";
import type { Budget, Category, SavingsGoal, Transaction } from "@/types";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-salary", name: "Salary", type: "income", color: "#22c55e", icon: "💰" },
  { id: "cat-freelance", name: "Freelance", type: "income", color: "#06b6d4", icon: "💻" },
  { id: "cat-investment", name: "Investment", type: "income", color: "#8b5cf6", icon: "📈" },
  { id: "cat-gift", name: "Gift", type: "income", color: "#ec4899", icon: "🎁" },
  { id: "cat-food", name: "Food & Dining", type: "expense", color: "#f97316", icon: "🍔" },
  { id: "cat-transport", name: "Transport", type: "expense", color: "#eab308", icon: "🚗" },
  { id: "cat-shopping", name: "Shopping", type: "expense", color: "#ef4444", icon: "🛍️" },
  { id: "cat-bills", name: "Bills & Utilities", type: "expense", color: "#6366f1", icon: "📋" },
  { id: "cat-health", name: "Health", type: "expense", color: "#14b8a6", icon: "🏥" },
  { id: "cat-entertainment", name: "Entertainment", type: "expense", color: "#f43f5e", icon: "🎬" },
  { id: "cat-education", name: "Education", type: "expense", color: "#3b82f6", icon: "📚" },
  { id: "cat-other-in", name: "Other", type: "income", color: "#94a3b8", icon: "📥" },
  { id: "cat-other-ex", name: "Other", type: "expense", color: "#64748b", icon: "📤" },
];

function randomDate(daysBack: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return d.toISOString().split("T")[0];
}

export function generateSeedTransactions(): Transaction[] {
  const now = new Date().toISOString();
  const data: Omit<Transaction, "id" | "createdAt">[] = [
    { type: "income", amount: 5000, categoryId: "cat-salary", description: "Monthly salary", date: randomDate(5) },
    { type: "income", amount: 1200, categoryId: "cat-freelance", description: "Website project", date: randomDate(10) },
    { type: "income", amount: 350, categoryId: "cat-investment", description: "Stock dividends", date: randomDate(15) },
    { type: "income", amount: 5000, categoryId: "cat-salary", description: "Monthly salary", date: randomDate(35) },
    { type: "income", amount: 800, categoryId: "cat-freelance", description: "Logo design", date: randomDate(40) },
    { type: "income", amount: 100, categoryId: "cat-gift", description: "Birthday gift", date: randomDate(20) },
    { type: "expense", amount: 85, categoryId: "cat-food", description: "Grocery shopping", date: randomDate(2) },
    { type: "expense", amount: 42, categoryId: "cat-food", description: "Restaurant dinner", date: randomDate(4) },
    { type: "expense", amount: 35, categoryId: "cat-transport", description: "Gas station", date: randomDate(3) },
    { type: "expense", amount: 120, categoryId: "cat-shopping", description: "New shoes", date: randomDate(7) },
    { type: "expense", amount: 200, categoryId: "cat-bills", description: "Electricity bill", date: randomDate(8) },
    { type: "expense", amount: 65, categoryId: "cat-bills", description: "Internet bill", date: randomDate(9) },
    { type: "expense", amount: 150, categoryId: "cat-health", description: "Doctor visit", date: randomDate(12) },
    { type: "expense", amount: 30, categoryId: "cat-entertainment", description: "Movie tickets", date: randomDate(6) },
    { type: "expense", amount: 250, categoryId: "cat-education", description: "Online course", date: randomDate(14) },
    { type: "expense", amount: 55, categoryId: "cat-food", description: "Coffee & snacks", date: randomDate(1) },
    { type: "expense", amount: 180, categoryId: "cat-shopping", description: "Electronics", date: randomDate(18) },
    { type: "expense", amount: 90, categoryId: "cat-bills", description: "Phone bill", date: randomDate(25) },
    { type: "expense", amount: 75, categoryId: "cat-transport", description: "Uber rides", date: randomDate(22) },
    { type: "expense", amount: 45, categoryId: "cat-entertainment", description: "Streaming subscriptions", date: randomDate(30) },
    { type: "income", amount: 5000, categoryId: "cat-salary", description: "Monthly salary", date: randomDate(65) },
    { type: "expense", amount: 95, categoryId: "cat-food", description: "Weekly groceries", date: randomDate(50) },
    { type: "expense", amount: 200, categoryId: "cat-bills", description: "Electricity bill", date: randomDate(55) },
    { type: "expense", amount: 300, categoryId: "cat-shopping", description: "Clothing", date: randomDate(60) },
    { type: "income", amount: 200, categoryId: "cat-investment", description: "Bond interest", date: randomDate(45) },
  ];

  return data.map((d) => ({ ...d, id: uuid(), createdAt: now }));
}

export function generateSeedBudgets(): Budget[] {
  const now = new Date().toISOString();
  const data: Omit<Budget, "id" | "createdAt">[] = [
    { categoryId: "cat-food", amount: 500 },
    { categoryId: "cat-transport", amount: 200 },
    { categoryId: "cat-shopping", amount: 400 },
    { categoryId: "cat-bills", amount: 450 },
    { categoryId: "cat-entertainment", amount: 150 },
  ];
  return data.map((d) => ({ ...d, id: uuid(), createdAt: now }));
}

export function generateSeedGoals(): SavingsGoal[] {
  const now = new Date().toISOString();
  const future = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  };
  const data: Omit<SavingsGoal, "id" | "createdAt">[] = [
    { name: "Emergency Fund", targetAmount: 10000, currentAmount: 6500, color: "#22c55e", icon: "🛟", deadline: future(180) },
    { name: "New Laptop", targetAmount: 2000, currentAmount: 1850, color: "#8b5cf6", icon: "💻", deadline: future(60) },
    { name: "Dream Vacation", targetAmount: 5000, currentAmount: 1200, color: "#06b6d4", icon: "🏝️", deadline: future(300) },
    { name: "New Car", targetAmount: 25000, currentAmount: 25000, color: "#f97316", icon: "🚗" },
  ];
  return data.map((d) => ({ ...d, id: uuid(), createdAt: now }));
}
