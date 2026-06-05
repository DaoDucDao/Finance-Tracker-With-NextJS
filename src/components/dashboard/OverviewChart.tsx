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
import Card from "@/components/ui/card";

interface OverviewChartProps {
  data: MonthlyStats[];
}

export default function OverviewChart({ data }: OverviewChartProps) {
  const chartData = data.slice(-6).map((entry) => ({
    ...entry,
    name: getMonthLabel(entry.month),
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
        <BarChart data={chartData} barCategoryGap="28%">
          <CartesianGrid
            vertical={false}
            stroke="var(--border)"
            strokeOpacity={0.6}
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            dy={6}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            width={48}
          />
          <Tooltip
            cursor={{ fill: "var(--muted-foreground)", opacity: 0.08, radius: 8 }}
            contentStyle={{
              backgroundColor: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              color: "var(--popover-foreground)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            }}
          />
          <Legend
            iconType="circle"
            iconSize={9}
            formatter={(value) => (
              <span className="text-xs text-muted-foreground">{value}</span>
            )}
          />
          <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} name="Income" maxBarSize={36} />
          <Bar dataKey="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Expense" maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
