"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { MonthlyStats } from "@/types";
import { formatCurrency, getMonthLabel } from "@/utils/format";
import { Card } from "@/components/ui/card";

interface MonthlyReportProps {
  data: MonthlyStats[];
}

export default function MonthlyReport({ data }: MonthlyReportProps) {
  const chartData = data.map((d) => ({
    ...d,
    name: getMonthLabel(d.month),
  }));

  if (chartData.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Balance Trend</h3>
        <p className="py-12 text-center text-muted-foreground">No data yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance trend chart */}
      <Card className="p-6">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Balance Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#22c55e"
              fill="url(#balanceGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Monthly table */}
      <Card className="overflow-hidden">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-sm font-semibold text-foreground">Monthly Breakdown</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                Month
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground">
                Income
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground">
                Expense
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground">
                Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {[...data].reverse().map((row) => (
              <tr
                key={row.month}
                className="border-b border-border/50 transition-colors hover:bg-secondary/40"
              >
                <td className="px-6 py-3 text-sm text-foreground">
                  {getMonthLabel(row.month)}
                </td>
                <td className="px-6 py-3 text-sm text-emerald-400 text-right">
                  +{formatCurrency(row.income)}
                </td>
                <td className="px-6 py-3 text-sm text-red-400 text-right">
                  -{formatCurrency(row.expense)}
                </td>
                <td
                  className={`px-6 py-3 text-sm font-medium text-right ${
                    row.balance >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {formatCurrency(row.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
