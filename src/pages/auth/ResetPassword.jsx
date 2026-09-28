import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import PasswordField from "../../components/ui/PasswordField";
import FullScreenLoader from "../../components/ui/FullScreenLoader";
import { useAuth } from "../../hooks/useAuth";

export default function ResetPassword() {
  const { user, loading, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <FullScreenLoader />;

  // The email link signs the user in temporarily. No session = bad/expired link.
  if (!user) {
    return (
      <AuthLayout
        title="Link expired"
        footer={
          <Link to="/login" className="font-semibold text-ink underline">
            Back to sign in
          </Link>
        }
      >
        <div className="space-y-4">
          <Alert variant="error">
            This reset link is invalid or has expired. Request a new one.
          </Alert>
          <Link to="/forgot-password">
            <Button className="w-full">Request a new link</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await updatePassword(password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Could not update your password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Set a new password" subtitle="Choose something you'll remember.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}
        <PasswordField
          label="New password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint="At least 8 characters."
        />
        <PasswordField
          label="Confirm new password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting && <LoaderCircle size={18} className="animate-spin" />}
          {submitting ? "Saving…" : "Update password"}
        </Button>
      </form>
    </AuthLayout>
  );
}