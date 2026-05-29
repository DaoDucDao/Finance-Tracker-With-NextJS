"use client";

import { useEffect, useMemo, useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { useBudgets } from "@/hooks/useBudgets";
import BudgetCard from "@/components/budgets/BudgetCard";
import BudgetForm from "@/components/budgets/BudgetForm";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { formatCurrency, getMonthKey, getMonthLabel } from "@/utils/format";
import type { Budget } from "@/types";

export default function BudgetsPage() {
  const { transactions, isLoaded: txLoaded } = useTransactions();
  const { categories, initDefaults } = useCategories();
  const {
    budgets,
    isLoaded: budgetsLoaded,
    addBudget,
    updateBudget,
    deleteBudget,
    initSeedData,
  } = useBudgets();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Budget | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (budgetsLoaded) {
      initDefaults();
      initSeedData();
    }
  }, [budgetsLoaded, initDefaults, initSeedData]);

  const currentMonth = getMonthKey(new Date().toISOString());

  const spentByCategory = useMemo(() => {
    const map = new Map<string, number>();
    transactions.forEach((t) => {
      if (t.type !== "expense") return;
      if (getMonthKey(t.date) !== currentMonth) return;
      map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount);
    });
    return map;
  }, [transactions, currentMonth]);

  const totals = useMemo(() => {
    const limit = budgets.reduce((s, b) => s + b.amount, 0);
    const spent = budgets.reduce(
      (s, b) => s + (spentByCategory.get(b.categoryId) ?? 0),
      0
    );
    return { limit, spent, remaining: limit - spent };
  }, [budgets, spentByCategory]);

  const totalPct = totals.limit > 0 ? (totals.spent / totals.limit) * 100 : 0;
  const usedCategoryIds = budgets.map((b) => b.categoryId);

  if (!txLoaded || !budgetsLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Budgets</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Monthly spending limits · {getMonthLabel(currentMonth)}
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(undefined);
            setShowForm(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition-colors"
        >
          + Add Budget
        </button>
      </div>

      {/* Overall summary banner */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/40 p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Spent this month
            </p>
            <p className="mt-1 text-3xl font-bold text-white">
              {formatCurrency(totals.spent)}
              <span className="text-base font-normal text-zinc-500">
                {" "}
                / {formatCurrency(totals.limit)}
              </span>
            </p>
          </div>
          <p
            className={`text-sm font-medium ${
              totals.remaining < 0 ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {totals.remaining < 0
              ? `${formatCurrency(Math.abs(totals.remaining))} over total`
              : `${formatCurrency(totals.remaining)} left to spend`}
          </p>
        </div>
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${
              totalPct > 100
                ? "from-red-500 to-rose-600"
                : totalPct >= 80
                ? "from-amber-400 to-orange-500"
                : "from-emerald-400 to-emerald-600"
            }`}
            style={{ width: `${Math.min(totalPct, 100)}%` }}
          />
        </div>
      </div>

      {budgets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 py-16 text-center">
          <p className="text-4xl">🎯</p>
          <p className="mt-3 text-zinc-400">No budgets yet</p>
          <p className="text-sm text-zinc-600">
            Add a budget to start tracking your spending limits.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.map((b) => (
            <BudgetCard
              key={b.id}
              budget={b}
              category={categories.find((c) => c.id === b.categoryId)}
              spent={spentByCategory.get(b.categoryId) ?? 0}
              onEdit={(budget) => {
                setEditing(budget);
                setShowForm(true);
              }}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "Edit Budget" : "Add Budget"}
      >
        <BudgetForm
          categories={categories}
          usedCategoryIds={usedCategoryIds}
          initialData={editing}
          onSubmit={(data) => {
            if (editing) {
              updateBudget(editing.id, data);
            } else {
              addBudget(data);
            }
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteBudget(deleteId);
        }}
        title="Delete Budget"
        message="Are you sure you want to delete this budget?"
      />
    </div>
  );
}
