import { api, qs } from "../lib/api";

export const fetchBudgets = async (month, year) => (await api.get(`/api/data/budgets${qs({ month, year })}`)).data;
export const upsertBudget = (p) => api.post("/api/data/budgets", p);
export const deleteBudget = (id) => api.del(`/api/data/budgets${qs({ id })}`);