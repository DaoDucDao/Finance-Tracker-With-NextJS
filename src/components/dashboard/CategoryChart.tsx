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
            innerRadius={62}
            outerRadius={98}
            paddingAngle={2}
            cornerRadius={6}
            dataKey="value"
            stroke="var(--card)"
            strokeWidth={3}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              color: "var(--popover-foreground)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            }}
            formatter={(value) => [`$${Number(value).toFixed(2)}`, "Amount"]}
          />
          <Legend
            iconType="circle"
            iconSize={9}
            wrapperStyle={{ fontSize: "12px", lineHeight: "1.6" }}
            formatter={(value) => (
              <span className="text-xs text-muted-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
