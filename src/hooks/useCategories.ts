"use client";

import { useCallback } from "react";
import { v4 as uuid } from "uuid";
import type { Category, TransactionType } from "@/types";
import { useLocalStorage } from "./useLocalStorage";
import { DEFAULT_CATEGORIES } from "@/utils/seed";

export function useCategories() {
  const [categories, setCategories, isLoaded] = useLocalStorage<Category[]>(
    "finance-categories",
    DEFAULT_CATEGORIES
  );

  const initDefaults = useCallback(() => {
    if (isLoaded && categories.length === 0) {
      setCategories(DEFAULT_CATEGORIES);
    }
  }, [isLoaded, categories.length, setCategories]);

  const addCategory = useCallback(
    (data: Omit<Category, "id">) => {
      const newCat: Category = { ...data, id: uuid() };
      setCategories((prev) => [...prev, newCat]);
    },
    [setCategories]
  );

  const updateCategory = useCallback(
    (id: string, data: Partial<Omit<Category, "id">>) => {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...data } : c))
      );
    },
    [setCategories]
  );

  const deleteCategory = useCallback(
    (id: string) => {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    },
    [setCategories]
  );

  const getByType = useCallback(
    (type: TransactionType) => categories.filter((c) => c.type === type),
    [categories]
  );

  const getById = useCallback(
    (id: string) => categories.find((c) => c.id === id),
    [categories]
  );

  return {
    categories,
    isLoaded,
    addCategory,
    updateCategory,
    deleteCategory,
    getByType,
    getById,
    initDefaults,
  };
}
