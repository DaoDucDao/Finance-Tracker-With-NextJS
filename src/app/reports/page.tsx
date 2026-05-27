"use client";

import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import MonthlyReport from "@/components/reports/MonthlyReport";
import CategoryChart from "@/components/dashboard/CategoryChart";
import StatCard from "@/components/dashboard/StatCard";
import { exportToCSV } from "@/utils/csv";

export default function ReportsPage() {
  const { transactions, stats, monthlyData } = useTransactions();
  const { categories } = useCategories();

  const avgMonthlyExpense =
    monthlyData.length > 0
      ? monthlyData.reduce((s, m) => s + m.expense, 0) / monthlyData.length
      : 0;

  const avgMonthlyIncome =
    monthlyData.length > 0
      ? monthlyData.reduce((s, m) => s + m.income, 0) / monthlyData.length
      : 0;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Analyze your financial trends
          </p>
        </div>
        <button
          onClick={() => exportToCSV(transactions, categories)}
          className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors border border-zinc-700"
        >
          Export All CSV
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Avg Monthly Income"
          amount={avgMonthlyIncome}
          icon="📊"
          color="green"
        />
        <StatCard
          title="Avg Monthly Expense"
          amount={avgMonthlyExpense}
          icon="📉"
          color="red"
        />
        <StatCard
          title="Net Balance"
          amount={stats.balance}
          icon="💰"
          color="blue"
        />
        <StatCard
          title="Months Tracked"
          amount={monthlyData.length}
          icon="📅"
          color="purple"
          subtitle="months of data"
        />
      </div>

      {/* Balance trend */}
      <MonthlyReport data={monthlyData} />

      {/* Category breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart
          transactions={transactions}
          categories={categories}
          type="expense"
        />
        <CategoryChart
          transactions={transactions}
          categories={categories}
          type="income"
        />
      </div>
    </div>
  );
}
