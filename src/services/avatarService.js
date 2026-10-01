import { supabase } from "../lib/supabase";

const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function uploadAvatar(userId, file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Please upload a JPG, PNG, or WEBP image.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("Image must be smaller than 2MB.");
  }

  const ext = file.name.split(".").pop();
  // Fixed filename per user so re-uploads overwrite instead of piling up
  const path = `${userId}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, cacheControl: "3600" });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  // Cache-bust so the new image shows immediately instead of a stale cached one
  const publicUrl = `${data.publicUrl}?v=${Date.now()}`;

  const { error: updateError } = await supabase.auth.updateUser({
    data: { avatar_url: publicUrl },
  });
  if (updateError) throw updateError;

  return publicUrl;
}

export async function removeAvatar(userId, currentUrl) {
  if (currentUrl) {
    // Extract the stored path (e.g. "userId/avatar.png") from the public URL
    const match = currentUrl.match(/avatars\/(.+?)(\?|$)/);
    if (match) {
      await supabase.storage.from("avatars").remove([match[1]]);
    }
  }
  const { error } = await supabase.auth.updateUser({ data: { avatar_url: null } });
  if (error) throw error;
}