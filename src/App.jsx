import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import PublicRoute from "./components/routing/PublicRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AuthCallback from "./pages/auth/AuthCallback";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import History from "./pages/History";
import Transportation from "./pages/Transportation";
import Reports from "./pages/Reports";
import Budgets from "./pages/Budgets";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Standalone: reached via email links, not gated by session state */}
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="auth/callback" element={<AuthCallback />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="add" element={<AddExpense />} />
          <Route path="history" element={<History />} />
          <Route path="transportation" element={<Transportation />} />
          <Route path="reports" element={<Reports />} />
          <Route path="budgets" element={<Budgets />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}