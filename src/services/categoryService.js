import { api, qs } from "../lib/api";

export const fetchCustomCategories = async () => (await api.get("/api/data/categories")).data;
export const createCustomCategory = async (name) => (await api.post("/api/data/categories", { name })).data;
export const deleteCustomCategory = (id) => api.del(`/api/data/categories${qs({ id })}`);