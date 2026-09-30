import { useCallback, useEffect, useState } from "react";
import { fetchCustomCategories } from "../services/categoryService";
import { DEFAULT_OTHER_CATEGORIES } from "../lib/categories";

export function useCategories() {
  const [custom, setCustom] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    return fetchCustomCategories()
      .then(setCustom)
      .catch(() => setCustom([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const allCategories = [...DEFAULT_OTHER_CATEGORIES.slice(0, -1), ...custom.map((c) => c.name), "Other"];

  return { customCategories: custom, allCategories, loading, refresh };
}