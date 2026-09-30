import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LogOut, Trash2 } from "lucide-react";
import SettingsSection from "./SettingsSection";
import Button from "../ui/Button";
import ConfirmDialog from "../ui/ConfirmDialog";
import { useAuth } from "../../hooks/useAuth";
import { deleteMyAccount } from "../../services/settingsService";

export default function DangerZone() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      await deleteMyAccount();
      await signOut().catch(() => {});
      toast.success("Your account has been deleted.");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err.message || "Could not delete your account.");
      setDeleting(false);
    }
  }

  return (
    <>
      <SettingsSection title="Account">
        <Button variant="soft" onClick={() => signOut()}>
          <LogOut size={16} /> Sign out
        </Button>
        <div className="border-t border-beige pt-4">
          <p className="mb-3 text-xs text-earth-dark">
            Deleting your account permanently removes all your expenses, categories, routes, and budgets. This cannot be undone.
          </p>
          <button
            onClick={() => setConfirmOpen(true)}
            className="flex items-center gap-2 text-sm font-semibold text-danger"
          >
            <Trash2 size={16} /> Delete my account
          </button>
        </div>
      </SettingsSection>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete your account?"
        message="This permanently deletes your account and all your data. This action cannot be undone."
        confirmLabel="Delete account"
        loading={deleting}
        onConfirm={handleDeleteAccount}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}