import type { Transaction, Category } from "@/types";
import { formatDate } from "./format";

export function exportToCSV(transactions: Transaction[], categories: Category[]) {
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  const header = "Date,Type,Category,Description,Amount";
  const rows = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((t) => {
      const category = categoryMap.get(t.categoryId) ?? "Unknown";
      const amount = t.type === "expense" ? -t.amount : t.amount;
      const desc = t.description.includes(",") ? `"${t.description}"` : t.description;
      return `${formatDate(t.date)},${t.type},${category},${desc},${amount}`;
    });

  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
