"use client";

import { useState, useMemo } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import TransactionTable from "@/components/transactions/TransactionTable";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionForm from "@/components/transactions/TransactionForm";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { exportToCSV } from "@/utils/csv";
import { getMonthKey, getMonthLabel } from "@/utils/format";
import type { Transaction, TransactionType } from "@/types";

export default function TransactionsPage() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, getFiltered } =
    useTransactions();
  const { categories } = useCategories();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Transaction | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<TransactionType | "">("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  const filtered = useMemo(
    () =>
      getFiltered({
        type: filterType || undefined,
        categoryId: filterCategory || undefined,
        month: filterMonth || undefined,
        search: search || undefined,
      }),
    [getFiltered, filterType, filterCategory, filterMonth, search]
  );

  const availableMonths = useMemo(() => {
    const months = new Set(transactions.map((t) => getMonthKey(t.date)));
    return Array.from(months)
      .sort()
      .reverse()
      .map((m) => m);
  }, [transactions]);

  const monthLabels = useMemo(
    () => availableMonths.map((m) => ({ value: m, label: getMonthLabel(m) })),
    [availableMonths]
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your income and expenses
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => exportToCSV(filtered, categories)}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors border border-zinc-700"
          >
            Export CSV
          </button>
          <button
            onClick={() => {
              setEditing(undefined);
              setShowForm(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition-colors"
          >
            + Add Transaction
          </button>
        </div>
      </div>

      <TransactionFilters
        search={search}
        onSearchChange={setSearch}
        type={filterType}
        onTypeChange={setFilterType}
        categoryId={filterCategory}
        onCategoryChange={setFilterCategory}
        month={filterMonth}
        onMonthChange={setFilterMonth}
        categories={categories}
        months={availableMonths}
      />

      <TransactionTable
        transactions={filtered}
        categories={categories}
        onEdit={(t) => {
          setEditing(t);
          setShowForm(true);
        }}
        onDelete={(id) => setDeleteId(id)}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "Edit Transaction" : "Add Transaction"}
      >
        <TransactionForm
          categories={categories}
          initialData={editing}
          onSubmit={(data) => {
            if (editing) {
              updateTransaction(editing.id, data);
            } else {
              addTransaction(data);
            }
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteTransaction(deleteId);
        }}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
      />
    </div>
  );
}
