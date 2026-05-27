"use client";

import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import CategoryList from "@/components/categories/CategoryList";
import CategoryForm from "@/components/categories/CategoryForm";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { Category } from "@/types";

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Organize your transactions by category
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(undefined);
            setShowForm(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition-colors"
        >
          + Add Category
        </button>
      </div>

      <CategoryList
        categories={categories}
        onEdit={(cat) => {
          setEditing(cat);
          setShowForm(true);
        }}
        onDelete={(id) => setDeleteId(id)}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "Edit Category" : "Add Category"}
      >
        <CategoryForm
          initialData={editing}
          onSubmit={(data) => {
            if (editing) {
              updateCategory(editing.id, data);
            } else {
              addCategory(data);
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
          if (deleteId) deleteCategory(deleteId);
        }}
        title="Delete Category"
        message="Are you sure you want to delete this category? Transactions using this category will show as 'Unknown'."
      />
    </div>
  );
}
