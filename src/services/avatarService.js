import { api, refreshUser } from "../lib/api";

const MAX = 2 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1]);
    r.onerror = () => reject(new Error("Could not read the file."));
    r.readAsDataURL(file);
  });

export async function uploadAvatar(_userId, file) {
  if (!TYPES.includes(file.type)) throw new Error("Please upload a JPG, PNG, or WEBP image.");
  if (file.size > MAX) throw new Error("Image must be smaller than 2MB.");
  const { url } = await api.post("/api/data/avatar", { contentType: file.type, data: await toBase64(file) });
  refreshUser();
  return url;
}

export async function removeAvatar() {
  await api.del("/api/data/avatar");
  refreshUser();
}