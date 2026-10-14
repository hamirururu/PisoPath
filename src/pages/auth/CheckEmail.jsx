import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { api } from "../../lib/api";

const COOLDOWN = 60;
const RADIUS = 44;
const CIRC = 2 * Math.PI * RADIUS;
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

function Envelope() {
  return (
    <svg viewBox="0 0 64 64" className="pp-float size-14" aria-hidden="true">
      <rect x="6" y="14" width="52" height="38" rx="8" fill="#ECE7D1" stroke="#8A7650" strokeWidth="3" />
      <path d="M8 18l24 18 24-18" fill="none" stroke="#8A7650" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="50" cy="16" r="7" fill="#8E977D" />
    </svg>
  );
}

export default function CheckEmail() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [email, setEmail] = useState("");
  const [availableAt, setAvailableAt] = useState(0); // server clock (ms)
  const [offset, setOffset] = useState(0); // serverNow - clientNow
  const [now, setNow] = useState(Date.now());
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: "success" | "error", text }

  useEffect(() => {
    let alive = true;
    api.get("/api/auth/pending")
      .then((d) => {
        if (!alive) return;
        if (!d.pending) return navigate("/register", { replace: true });
        setEmail(d.email);
        setAvailableAt(d.resendAvailableAt);
        setOffset(d.serverNow - Date.now());
        setNow(Date.now());
        setStatus("ready");
      })
      .catch(() => alive && setStatus("error"));
    return () => { alive = false; };
  }, [navigate]);

  // Remaining time is derived from an absolute server timestamp, so it stays accurate across
  // refreshes and tab throttling. One interval exists only while cooling down.
  const remaining = Math.max(0, Math.ceil((availableAt - (now + offset)) / 1000));
  const cooling = remaining > 0;
  useEffect(() => {
    if (!cooling) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [cooling]);

  useEffect(() => {
    if (feedback?.type !== "success") return;
    const id = setTimeout(() => setFeedback(null), 5000);
    return () => clearTimeout(id);
  }, [feedback]);

  async function handleResend() {
    if (sending || cooling) return;
    setSending(true);
    setFeedback(null);
    try {
      const d = await api.post("/api/auth/resend");
      setOffset(d.serverNow - Date.now());
      setAvailableAt(d.resendAvailableAt);
      setNow(Date.now());
      setFeedback({ type: "success", text: "A new confirmation email has been requested." });
    } catch (err) {
      if (err.status === 429 && err.retryAfter) {
        setAvailableAt(Date.now() + offset + err.retryAfter * 1000);
        setNow(Date.now());
      }
      if (err.code === "no_pending") return navigate("/register", { replace: true });
      setFeedback({ type: "error", text: err.message });
    } finally {
      setSending(false);
    }
  }

  async function useDifferentEmail() {
    await api.post("/api/auth/cancel-pending").catch(() => {});
    navigate("/register", { replace: true });
  }

  if (status === "loading") {
    return (
      <AuthLayout title="Check Your Email">
        <div className="flex justify-center py-8"><Spinner size={36} /></div>
      </AuthLayout>
    );
  }
  if (status === "error") {
    return (
      <AuthLayout title="Check Your Email" footer={<Link to="/login" className="font-semibold text-ink underline">Back to sign in</Link>}>
        <p className="text-sm text-earth-dark">We couldn't load this page. Check your connection and refresh.</p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Check Your Email"
      footer={<Link to="/login" className="font-semibold text-ink underline">Back to sign in</Link>}
    >
      <div className="pp-card-in flex flex-col items-center gap-4 text-center">
        <div className="relative grid size-28 place-items-center">
          <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
            <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#DBCEA5" strokeWidth="5" />
            <circle
              cx="50" cy="50" r={RADIUS} fill="none" stroke="#8E977D" strokeWidth="5" strokeLinecap="round"
              className="pp-ring"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - Math.min(1, remaining / COOLDOWN))}
            />
          </svg>
          <Envelope />
        </div>

        <p className="text-sm">
          We've requested a confirmation email for <strong>{email}</strong>. Open the link in it to activate your account.
        </p>

        <div className="w-full rounded-2xl bg-cream p-4 text-sm ring-1 ring-beige">
          <p className="font-medium">Didn't receive the email?</p>
          <p className="mt-1 text-xs text-earth-dark">Check your spam folder, then request another.</p>
          <p role="timer" aria-live="off" className="mt-2 text-xs text-earth-dark">
            {cooling ? <>You can request another email in <strong>{fmt(remaining)}</strong>.</> : "You can request another email now."}
          </p>
          <Button className="mt-3 w-full" onClick={handleResend} disabled={cooling || sending}>
            {sending && <LoaderCircle size={16} className="animate-spin" />}
            {sending ? "Sending…" : "Resend email"}
          </Button>
        </div>

        <div aria-live="polite" className="min-h-6 w-full text-sm">
          {feedback?.type === "success" && (
            <p className="pp-pop flex items-center justify-center gap-2 text-ink"><CircleCheck size={18} className="text-sage" />{feedback.text}</p>
          )}
          {feedback?.type === "error" && (
            <p className="flex items-center justify-center gap-2 text-danger"><CircleAlert size={18} />{feedback.text}</p>
          )}
        </div>

        <button onClick={useDifferentEmail} className="text-xs font-medium text-earth-dark underline">
          Use a different email
        </button>
      </div>
    </AuthLayout>
  );
}