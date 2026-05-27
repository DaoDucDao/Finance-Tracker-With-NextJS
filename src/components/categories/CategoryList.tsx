"use client";

import type { Category } from "@/types";

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export default function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  const renderGroup = (title: string, items: Category[]) => (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h3 className="text-sm font-medium text-zinc-400 mb-4">{title}</h3>
      {items.length === 0 ? (
        <p className="text-zinc-500 text-sm">No categories</p>
      ) : (
        <div className="space-y-2">
          {items.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between py-3 px-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ backgroundColor: cat.color + "20" }}
                >
                  {cat.icon}
                </span>
                <div>
                  <p className="text-sm text-zinc-200 font-medium">{cat.name}</p>
                  <p className="text-xs text-zinc-500 capitalize">{cat.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <button
                  onClick={() => onEdit(cat)}
                  className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors ml-2"
                >
                  Edit
                </button>
                {!cat.id.startsWith("cat-") && (
                  <button
                    onClick={() => onDelete(cat.id)}
                    className="text-xs text-zinc-400 hover:text-red-400 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {renderGroup(`Income Categories (${incomeCategories.length})`, incomeCategories)}
      {renderGroup(`Expense Categories (${expenseCategories.length})`, expenseCategories)}
    </div>
  );
}
