import { useEffect, useState } from "react";
import { fetchCustomCategories } from "../services/categoryService";
import { DEFAULT_OTHER_CATEGORIES } from "../lib/categories";

export function useCategories() {
  const [custom, setCustom] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomCategories()
      .then(setCustom)
      .catch(() => setCustom([]))
      .finally(() => setLoading(false));
  }, []);

  const allCategories = [...DEFAULT_OTHER_CATEGORIES.slice(0, -1), ...custom.map((c) => c.name), "Other"];

  return { customCategories: custom, allCategories, loading };
}