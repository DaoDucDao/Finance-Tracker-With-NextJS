import type { BackupData, Budget, Category, SavingsGoal, Transaction } from "@/types";

const BACKUP_VERSION = 1;

const buildBackup = (data: {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  goals: SavingsGoal[];
}): BackupData => ({
  version: BACKUP_VERSION,
  exportedAt: new Date().toISOString(),
  transactions: data.transactions,
  categories: data.categories,
  budgets: data.budgets,
  goals: data.goals,
});

const downloadBackup = (backup: BackupData) => {
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = new Date().toISOString().split("T")[0];

  link.href = url;
  link.download = `fintracker-backup-${stamp}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const parseBackup = (text: string): BackupData => {
  const parsed = JSON.parse(text);

  if (
    !parsed ||
    typeof parsed !== "object" ||
    !Array.isArray(parsed.transactions) ||
    !Array.isArray(parsed.categories)
  )
    throw new Error("This file is not a valid FinTracker backup.");

  return {
    version: typeof parsed.version === "number" ? parsed.version : BACKUP_VERSION,
    exportedAt: parsed.exportedAt ?? new Date().toISOString(),
    transactions: parsed.transactions,
    categories: parsed.categories,
    budgets: Array.isArray(parsed.budgets) ? parsed.budgets : [],
    goals: Array.isArray(parsed.goals) ? parsed.goals : [],
  };
};

export { buildBackup, downloadBackup, parseBackup };
