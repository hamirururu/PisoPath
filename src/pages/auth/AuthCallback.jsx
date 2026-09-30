import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

function readAuthError() {
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  const params = new URLSearchParams(hash || window.location.search);
  const description = params.get("error_description") || params.get("error");
  return description ? decodeURIComponent(description.replace(/\+/g, " ")) : "";
}

export default function AuthCallback() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [errorMessage] = useState(readAuthError);

  useEffect(() => {
    if (!loading && user && !errorMessage) {
      navigate("/", { replace: true });
    }
  }, [loading, user, errorMessage, navigate]);

  if (errorMessage) {
    return (
      <AuthLayout
        title="Confirmation link issue"
        footer={
          <Link to="/login" className="font-semibold text-ink underline">
            Back to sign in
          </Link>
        }
      >
        <div className="space-y-4">
          <Alert variant="error">{errorMessage}</Alert>
          <p className="text-sm text-earth-dark">
            This can happen if the link expired or was already used. Sign in, or
            register again to get a fresh link.
          </p>
          <Link to="/login">
            <Button className="w-full">Go to sign in</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Confirming your email">
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <LoaderCircle className="animate-spin text-earth" size={28} />
        <p className="text-sm text-earth-dark">Just a moment…</p>
      </div>
    </AuthLayout>
  );
}