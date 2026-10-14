import { api, qs } from "../lib/api";

const list = async (params) => (await api.get(`/api/data/expenses${qs(params)}`)).data;

export const fetchExpensesBetween = (from, to) => list({ mode: "between", from, to });
export const fetchRecentExpenses = (limit = 6) => list({ mode: "recent", limit });
export const fetchAllAmounts = () => list({ mode: "amounts" });
export const fetchAllExpensesFull = () => list({ mode: "all" });
export const fetchTransportationExpenses = () => list({ mode: "transport" });
export const fetchExpenseById = (id) => list({ mode: "one", id });

export const createTransportationExpense = async (p) =>
  (await api.post("/api/data/expenses", { kind: "transportation", ...p })).data.id;
export const createFoodExpense = (p) => api.post("/api/data/expenses", { kind: "food", ...p });
export const createOtherExpense = (p) => api.post("/api/data/expenses", { kind: "other", ...p });

export const updateTransportationExpense = (id, p) =>
  api.patch(`/api/data/expenses${qs({ id })}`, { kind: "transportation", ...p });
export const updateFoodExpense = (id, p) =>
  api.patch(`/api/data/expenses${qs({ id })}`, { kind: "food", ...p });
export const updateOtherExpense = (id, p) =>
  api.patch(`/api/data/expenses${qs({ id })}`, { kind: "other", ...p });

export const deleteExpense = (id) => api.del(`/api/data/expenses${qs({ id })}`);