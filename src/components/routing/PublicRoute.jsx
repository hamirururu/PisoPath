import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import FullScreenLoader from "../ui/FullScreenLoader";

// Login/Register/Forgot pages: signed-in users are sent back to where they came from
export default function PublicRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullScreenLoader />;
  if (user) {
    const to = location.state?.from?.pathname ?? "/";
    return <Navigate to={to} replace />;
  }
  return <Outlet />;
}