"use client";

import { useCallback } from "react";
import { v4 as uuid } from "uuid";
import type { Category, TransactionType } from "@/types";
import { useLocalStorage } from "./useLocalStorage";
import { DEFAULT_CATEGORIES } from "@/utils/seed";

const useCategories = () => {
  const [categories, setCategories, isLoaded] = useLocalStorage<Category[]>(
    "finance-categories",
    DEFAULT_CATEGORIES
  );

  const initDefaults = useCallback(() => {
    if (isLoaded && categories.length === 0) setCategories(DEFAULT_CATEGORIES);
  }, [isLoaded, categories.length, setCategories]);

  const addCategory = useCallback(
    (data: Omit<Category, "id">) => {
      const newCategory: Category = { ...data, id: uuid() };

      setCategories((prev) => [...prev, newCategory]);
    },
    [setCategories]
  );

  const updateCategory = useCallback(
    (id: string, data: Partial<Omit<Category, "id">>) => {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === id ? { ...category, ...data } : category
        )
      );
    },
    [setCategories]
  );

  const deleteCategory = useCallback(
    (id: string) => {
      setCategories((prev) => prev.filter((category) => category.id !== id));
    },
    [setCategories]
  );

  const getByType = useCallback(
    (type: TransactionType) =>
      categories.filter((category) => category.type === type),
    [categories]
  );

  const getById = useCallback(
    (id: string) => categories.find((category) => category.id === id),
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
};

export { useCategories };
