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
import { Card } from "@/components/ui/card";

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
      <Card className="p-6">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Monthly Overview
        </h3>
        <p className="py-12 text-center text-muted-foreground">No data yet</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Monthly Overview
      </h3>
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
          <Bar dataKey="income" fill="#22c55e" radius={[6, 6, 0, 0]} name="Income" maxBarSize={28} />
          <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} name="Expense" maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
