import type { Transaction, Category } from "@/types";
import { formatDate } from "./format";

const exportToCSV = (transactions: Transaction[], categories: Category[]) => {
  const categoryMap = new Map(
    categories.map((category) => [category.id, category.name])
  );

  const header = "Date,Type,Category,Description,Amount";
  const rows = transactions
    .sort(
      (first, second) =>
        new Date(second.date).getTime() - new Date(first.date).getTime()
    )
    .map((transaction) => {
      const category = categoryMap.get(transaction.categoryId) ?? "Unknown";
      const amount =
        transaction.type === "expense" ? -transaction.amount : transaction.amount;
      const description = transaction.description.includes(",")
        ? `"${transaction.description}"`
        : transaction.description;

      return `${formatDate(transaction.date)},${transaction.type},${category},${description},${amount}`;
    });

  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export { exportToCSV };
