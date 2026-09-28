import { useState } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import TextField from "../../components/ui/TextField";
import { useAuth } from "../../hooks/useAuth";

export default function ForgotPassword() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    try {
      await sendPasswordReset(email.trim());
      setSent(true);
    } catch (err) {
      setError(err.message || "Could not send the reset email.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="We'll email you a link to reset it."
      footer={
        <Link to="/login" className="font-semibold text-ink underline">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <Alert variant="success">
          If an account exists for <strong>{email}</strong>, a reset link is on
          its way. Check your inbox and spam folder.
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert variant="error">{error}</Alert>}
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting && <LoaderCircle size={18} className="animate-spin" />}
            {submitting ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}