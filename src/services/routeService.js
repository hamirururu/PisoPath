import { api, qs } from "../lib/api";

export const fetchFavoriteRoutes = async () => (await api.get(`/api/data/routes${qs({ kind: "favorites" })}`)).data;
export const fetchFrequentRoutes = async (limit = 5) => (await api.get(`/api/data/routes${qs({ kind: "frequent", limit })}`)).data;
export const saveFavoriteRoute = (p) => api.post("/api/data/routes", p);
export const deleteFavoriteRoute = (id) => api.del(`/api/data/routes${qs({ id })}`);