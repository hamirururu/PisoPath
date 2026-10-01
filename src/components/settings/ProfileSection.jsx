import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Camera, LoaderCircle, Trash2 } from "lucide-react";
import SettingsSection from "./SettingsSection";
import TextField from "../ui/TextField";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";
import { useAuth } from "../../hooks/useAuth";
import { updateFullName } from "../../services/settingsService";
import { uploadAvatar, removeAvatar } from "../../services/avatarService";

export default function ProfileSection() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  async function handleSave() {
    if (saving || !fullName.trim()) return;
    setSaving(true);
    try {
      await updateFullName(fullName.trim());
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err.message || "Could not update your profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadAvatar(user.id, file);
      setAvatarUrl(url);
      toast.success("Profile picture updated.");
    } catch (err) {
      toast.error(err.message || "Could not upload your photo.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleRemove() {
    setUploading(true);
    try {
      await removeAvatar(user.id, avatarUrl);
      setAvatarUrl("");
      toast.success("Profile picture removed.");
    } catch (err) {
      toast.error(err.message || "Could not remove your photo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <SettingsSection title="Profile">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar url={avatarUrl} name={fullName || user?.email} size={64} />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            aria-label="Change profile picture"
            className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full bg-earth text-cream ring-2 ring-paper disabled:opacity-60"
          >
            {uploading ? <LoaderCircle size={14} className="animate-spin" /> : <Camera size={14} />}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <div>
          <p className="text-sm font-medium">Profile picture</p>
          <p className="mb-1.5 text-xs text-earth-dark">JPG, PNG, or WEBP. Max 2MB.</p>
          {avatarUrl && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="flex items-center gap-1 text-xs font-medium text-danger disabled:opacity-50"
            >
              <Trash2 size={12} /> Remove photo
            </button>
          )}
        </div>
      </div>

      <TextField label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      <TextField label="Email address" value={user?.email || ""} disabled />
      <Button onClick={handleSave} disabled={saving} variant="soft">
        {saving && <LoaderCircle size={16} className="animate-spin" />}
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </SettingsSection>
  );
}