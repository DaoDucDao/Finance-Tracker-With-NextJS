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
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-sm font-medium text-zinc-400 mb-4">Balance Trend</h3>
        <p className="text-zinc-500 text-center py-12">No data yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance trend chart */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-sm font-medium text-zinc-400 mb-4">Balance Trend</h3>
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
      </div>

      {/* Monthly table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-400">Monthly Breakdown</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-xs text-zinc-500 font-medium px-6 py-3">
                Month
              </th>
              <th className="text-right text-xs text-zinc-500 font-medium px-6 py-3">
                Income
              </th>
              <th className="text-right text-xs text-zinc-500 font-medium px-6 py-3">
                Expense
              </th>
              <th className="text-right text-xs text-zinc-500 font-medium px-6 py-3">
                Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {[...data].reverse().map((row) => (
              <tr
                key={row.month}
                className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
              >
                <td className="px-6 py-3 text-sm text-zinc-300">
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
      </div>
    </div>
  );
}
