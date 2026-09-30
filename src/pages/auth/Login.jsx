import { useState } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import TextField from "../../components/ui/TextField";
import PasswordField from "../../components/ui/PasswordField";
import ResendConfirmation from "../../components/auth/ResendConfirmation";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [unconfirmed, setUnconfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setUnconfirmed(false);
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      const message = err.message || "Could not sign in. Please try again.";
      if (message.toLowerCase().includes("confirm")) {
        setUnconfirmed(true);
        setError("Please confirm your email before signing in.");
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to see your spending."
      footer={
        <>
          New to PisoPath?{" "}
          <Link to="/register" className="font-semibold text-ink underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="error">
            <p>{error}</p>
            {unconfirmed && (
              <div className="mt-2">
                <ResendConfirmation email={email.trim()} />
              </div>
            )}
          </Alert>
        )}
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
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-earth-dark underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting && <LoaderCircle size={18} className="animate-spin" />}
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthLayout>
  );
}