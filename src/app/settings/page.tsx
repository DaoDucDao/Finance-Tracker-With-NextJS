"use client";

import { useRef, useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { useBudgets } from "@/hooks/useBudgets";
import { useGoals } from "@/hooks/useGoals";
import ThemeToggle from "@/components/ui/ThemeToggle";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { buildBackup, downloadBackup, parseBackup } from "@/utils/backup";

const STORAGE_KEYS = {
  transactions: "finance-transactions",
  categories: "finance-categories",
  budgets: "finance-budgets",
  goals: "finance-goals",
};

export default function SettingsPage() {
  const { transactions, isLoaded: txLoaded } = useTransactions();
  const { categories } = useCategories();
  const { budgets } = useBudgets();
  const { goals } = useGoals();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );
  const [showReset, setShowReset] = useState(false);

  const handleExport = () => {
    const backup = buildBackup({ transactions, categories, budgets, goals });
    downloadBackup(backup);
    setMessage({ type: "ok", text: "Backup downloaded." });
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const backup = parseBackup(text);
      localStorage.setItem(
        STORAGE_KEYS.transactions,
        JSON.stringify(backup.transactions)
      );
      localStorage.setItem(
        STORAGE_KEYS.categories,
        JSON.stringify(backup.categories)
      );
      localStorage.setItem(STORAGE_KEYS.budgets, JSON.stringify(backup.budgets));
      localStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(backup.goals));
      setMessage({
        type: "ok",
        text: `Imported ${backup.transactions.length} transactions. Reloading...`,
      });
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      setMessage({
        type: "err",
        text: err instanceof Error ? err.message : "Could not read that file.",
      });
    } finally {
      e.target.value = "";
    }
  };

  const handleReset = () => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  };

  const stats = [
    { label: "Transactions", value: transactions.length, icon: "💳" },
    { label: "Categories", value: categories.length, icon: "🏷️" },
    { label: "Budgets", value: budgets.length, icon: "🎯" },
    { label: "Goals", value: goals.length, icon: "🏆" },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Appearance and data management
        </p>
      </div>

      {message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            message.type === "ok"
              ? "border-emerald-600/40 bg-emerald-600/10 text-emerald-400"
              : "border-red-600/40 bg-red-600/10 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Appearance */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-sm font-semibold text-white">Appearance</h2>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-300">Theme</p>
            <p className="text-xs text-zinc-500">Switch between dark and light mode</p>
          </div>
          <ThemeToggle />
        </div>
      </section>

      {/* Data snapshot */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-sm font-semibold text-white">Your data</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-zinc-800 p-4 text-center">
              <p className="text-xl">{s.icon}</p>
              <p className="mt-1 text-xl font-bold text-white">
                {txLoaded ? s.value : "—"}
              </p>
              <p className="text-xs text-zinc-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Backup & restore */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-sm font-semibold text-white">Backup &amp; restore</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Export all your data to a JSON file, or restore from a previous backup.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
          >
            ⬇ Export data
          </button>
          <button
            onClick={handleImportClick}
            className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-700"
          >
            ⬆ Import data
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFile}
            className="hidden"
          />
        </div>
        <p className="mt-3 text-xs text-amber-400/80">
          Importing replaces all current data with the contents of the file.
        </p>
      </section>

      {/* Danger zone */}
      <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-6">
        <h2 className="text-sm font-semibold text-red-400">Danger zone</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Permanently delete all transactions, categories, budgets, and goals.
        </p>
        <button
          onClick={() => setShowReset(true)}
          className="mt-4 rounded-xl border border-red-600/50 bg-red-600/10 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-600/20"
        >
          Reset all data
        </button>
      </section>

      <ConfirmDialog
        isOpen={showReset}
        onClose={() => setShowReset(false)}
        onConfirm={handleReset}
        title="Reset all data"
        message="This will permanently delete everything stored in this browser. This action cannot be undone. Consider exporting a backup first."
      />
    </div>
  );
}
