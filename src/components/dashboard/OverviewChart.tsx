"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { MonthlyStats } from "@/types";
import { getMonthLabel } from "@/utils/format";

interface OverviewChartProps {
  data: MonthlyStats[];
}

export default function OverviewChart({ data }: OverviewChartProps) {
  const chartData = data.slice(-6).map((d) => ({
    ...d,
    name: getMonthLabel(d.month),
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-sm font-medium text-zinc-400 mb-4">Monthly Overview</h3>
        <p className="text-zinc-500 text-center py-12">No data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h3 className="text-sm font-medium text-zinc-400 mb-4">Monthly Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 12 }} />
          <YAxis tick={{ fill: "#71717a", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: "12px",
              color: "#e4e4e7",
            }}
          />
          <Legend />
          <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} name="Income" />
          <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
