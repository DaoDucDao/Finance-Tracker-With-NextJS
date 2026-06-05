"use client";

import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import MonthlyReport from "@/components/reports/MonthlyReport";
import CategoryChart from "@/components/dashboard/CategoryChart";
import StatCard from "@/components/dashboard/StatCard";
import Button from "@/components/ui/button";
import { exportToCSV } from "@/utils/csv";

export default function ReportsPage() {
  const { transactions, stats, monthlyData } = useTransactions();
  const { categories } = useCategories();

  const avgMonthlyExpense =
    monthlyData.length > 0
      ? monthlyData.reduce((sum, month) => sum + month.expense, 0) /
        monthlyData.length
      : 0;

  const avgMonthlyIncome =
    monthlyData.length > 0
      ? monthlyData.reduce((sum, month) => sum + month.income, 0) /
        monthlyData.length
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
        <Button
          variant="outline"
          onClick={() => exportToCSV(transactions, categories)}
        >
          Export All CSV
        </Button>
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
