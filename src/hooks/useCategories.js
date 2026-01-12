import { useCallback } from 'react';
import { DEFAULT_CATEGORIES } from '../constants/colors';

export const useCategories = (data, updateData) => {
  const categories = data?.categories || [];

  // Inicializace výchozích kategorií
  const initializeCategories = useCallback(() => {
    if (categories.length === 0) {
      updateData((prev) => ({
        ...prev,
        categories: DEFAULT_CATEGORIES,
      }));
    }
  }, [categories.length, updateData]);

  // Přidání kategorie
  const addCategory = useCallback(
    (name, color) => {
      const newCategory = {
        id: `cat_${Date.now()}`,
        name,
        color,
      };

      updateData((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory],
      }));

      return newCategory;
    },
    [updateData]
  );

  // Úprava kategorie
  const updateCategory = useCallback(
    (categoryId, updates) => {
      updateData((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId ? { ...cat, ...updates } : cat
        ),
      }));
    },
    [updateData]
  );

  // Smazání kategorie
  const deleteCategory = useCallback(
    (categoryId) => {
      // Zkontrolovat, zda není kategorie používána
      const isUsed = Object.values(data?.weeks || {}).some((week) =>
        week.tasks.some((task) => task.categoryId === categoryId)
      );

      if (isUsed) {
        return { success: false, message: 'Kategorie je používána v úkolech' };
      }

      updateData((prev) => ({
        ...prev,
        categories: prev.categories.filter((cat) => cat.id !== categoryId),
      }));

      return { success: true };
    },
    [data?.weeks, updateData]
  );

  // Získání kategorie podle ID
  const getCategoryById = useCallback(
    (categoryId) => {
      return categories.find((cat) => cat.id === categoryId);
    },
    [categories]
  );

  return {
    categories,
    initializeCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
  };
};
