import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

export default function ResendConfirmation({ email }) {
  const { resendConfirmation } = useAuth();
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleResend() {
    if (sending || cooldown > 0 || !email) return;
    setSending(true);
    try {
      await resendConfirmation(email);
      toast.success("Confirmation email resent.");
      setCooldown(30);
    } catch (err) {
      toast.error(err.message || "Could not resend the email.");
    } finally {
      setSending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleResend}
      disabled={sending || cooldown > 0}
      className="text-sm font-semibold text-ink underline disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
    >
      {cooldown > 0 ? `Resend in ${cooldown}s` : sending ? "Sending…" : "Resend confirmation email"}
    </button>
  );
}