import { api, refreshUser } from "../lib/api";

export async function updateFullName(fullName) {
  await api.patch("/api/data/profile", { fullName });
  refreshUser();
}
export async function updateDateFormat(dateFormat) {
  await api.patch("/api/data/profile", { dateFormat });
  refreshUser();
}
export const deleteMyAccount = () => api.del("/api/data/account");