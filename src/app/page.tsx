"use client";

import { useEffect } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { useBudgets } from "@/hooks/useBudgets";
import { useGoals } from "@/hooks/useGoals";
import StatCard from "@/components/dashboard/StatCard";
import OverviewChart from "@/components/dashboard/OverviewChart";
import CategoryChart from "@/components/dashboard/CategoryChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import BudgetSnapshot from "@/components/dashboard/BudgetSnapshot";
import GoalsSnapshot from "@/components/dashboard/GoalsSnapshot";

export default function DashboardPage() {
  const { transactions, stats, monthlyData, isLoaded, initSeedData } = useTransactions();
  const { categories, initDefaults } = useCategories();
  const { budgets, isLoaded: budgetsLoaded, initSeedData: initBudgetSeed } = useBudgets();
  const { goals, isLoaded: goalsLoaded, initSeedData: initGoalSeed } = useGoals();

  useEffect(() => {
    if (isLoaded) {
      initDefaults();
      initSeedData();
    }
  }, [isLoaded, initDefaults, initSeedData]);

  useEffect(() => {
    if (budgetsLoaded) initBudgetSeed();
  }, [budgetsLoaded, initBudgetSeed]);

  useEffect(() => {
    if (goalsLoaded) initGoalSeed();
  }, [goalsLoaded, initGoalSeed]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Your financial overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Balance"
          amount={stats.balance}
          icon="💵"
          color="blue"
          subtitle={`${stats.count} transactions`}
        />
        <StatCard
          title="Total Income"
          amount={stats.totalIncome}
          icon="📈"
          color="green"
        />
        <StatCard
          title="Total Expenses"
          amount={stats.totalExpense}
          icon="📉"
          color="red"
        />
        <StatCard
          title="Savings Rate"
          amount={
            stats.totalIncome > 0
              ? Math.round(((stats.totalIncome - stats.totalExpense) / stats.totalIncome) * 100)
              : 0
          }
          icon="🎯"
          color="purple"
          format="percent"
          subtitle="of income saved"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OverviewChart data={monthlyData} />
        <CategoryChart
          transactions={transactions}
          categories={categories}
          type="expense"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetSnapshot
          transactions={transactions}
          categories={categories}
          budgets={budgets}
        />
        <GoalsSnapshot goals={goals} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions transactions={transactions} categories={categories} />
        <CategoryChart
          transactions={transactions}
          categories={categories}
          type="income"
        />
      </div>
    </div>
  );
}
