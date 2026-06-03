"use client";

import type { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export default function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
  const incomeCategories = categories.filter(
    (category) => category.type === "income"
  );
  const expenseCategories = categories.filter(
    (category) => category.type === "expense"
  );

  const renderGroup = (title: string, items: Category[]) => (
    <Card className="p-6">
      <h3 className="mb-4 text-sm font-medium text-muted-foreground">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No categories</p>
      ) : (
        <div className="space-y-2">
          {items.map((category) => (
            <div
              key={category.id}
              className="group flex items-center justify-between rounded-xl bg-secondary/40 px-4 py-3 transition-colors hover:bg-secondary"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                  style={{ backgroundColor: category.color + "20" }}
                >
                  {category.icon}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {category.name}
                  </p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {category.type}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className="mr-1 h-4 w-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(category)}
                  className="text-muted-foreground hover:text-emerald-400"
                >
                  Edit
                </Button>
                {!category.id.startsWith("cat-") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(category.id)}
                    className="text-muted-foreground hover:text-red-400"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {renderGroup(`Income Categories (${incomeCategories.length})`, incomeCategories)}
      {renderGroup(`Expense Categories (${expenseCategories.length})`, expenseCategories)}
    </div>
  );
}
