"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { Transaction, Category } from "@/types";
import { Card } from "@/components/ui/card";

interface CategoryChartProps {
  transactions: Transaction[];
  categories: Category[];
  type: "income" | "expense";
}

export default function CategoryChart({ transactions, categories, type }: CategoryChartProps) {
  const filtered = transactions.filter((t) => t.type === type);
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const grouped = new Map<string, number>();
  filtered.forEach((t) => {
    grouped.set(t.categoryId, (grouped.get(t.categoryId) ?? 0) + t.amount);
  });

  const data = Array.from(grouped.entries())
    .map(([id, value]) => {
      const cat = categoryMap.get(id);
      return {
        name: cat ? `${cat.icon} ${cat.name}` : "Unknown",
        value,
        color: cat?.color ?? "#64748b",
      };
    })
    .sort((a, b) => b.value - a.value);

  const title = type === "income" ? "Income by Category" : "Expenses by Category";

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
        <p className="py-12 text-center text-muted-foreground">No data yet</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: "12px",
              color: "#e4e4e7",
            }}
            formatter={(value) => [`$${Number(value).toFixed(2)}`, "Amount"]}
          />
          <Legend
            formatter={(value) => (
              <span className="text-xs text-muted-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
