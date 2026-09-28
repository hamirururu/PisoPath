import { useState } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle, MailCheck } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import TextField from "../../components/ui/TextField";
import PasswordField from "../../components/ui/PasswordField";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

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
      const data = await signUp(email.trim(), password, fullName.trim());
      // With email confirmation ON there is no session yet.
      if (!data.session) setNeedsConfirmation(true);
      // With confirmation OFF the session exists and PublicRoute redirects.
    } catch (err) {
      setError(err.message || "Could not create your account.");
    } finally {
      setSubmitting(false);
    }
  }

  if (needsConfirmation) {
    return (
      <AuthLayout
        title="Check your email"
        footer={
          <Link to="/login" className="font-semibold text-ink underline">
            Back to sign in
          </Link>
        }
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <MailCheck className="text-sage" size={36} />
          <p className="text-sm">
            We sent a confirmation link to <strong>{email}</strong>. Open it to
            activate your account, then sign in.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start tracking every peso."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-ink underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}
        <TextField
          label="Full name"
          autoComplete="name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Juan Dela Cruz"
        />
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
        <PasswordField
          label="Password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint="At least 8 characters."
        />
        <PasswordField
          label="Confirm password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting && <LoaderCircle size={18} className="animate-spin" />}
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}