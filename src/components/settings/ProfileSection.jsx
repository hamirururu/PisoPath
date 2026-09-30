import { useState } from "react";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import SettingsSection from "./SettingsSection";
import TextField from "../ui/TextField";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { updateFullName } from "../../services/settingsService";

export default function ProfileSection() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [saving, setSaving] = useState(false);

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

  return (
    <SettingsSection title="Profile">
      <TextField label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      <TextField label="Email address" value={user?.email || ""} disabled />
      <Button onClick={handleSave} disabled={saving} variant="soft">
        {saving && <LoaderCircle size={16} className="animate-spin" />}
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </SettingsSection>
  );
}