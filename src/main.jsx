import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./contexts/AuthProvider.jsx";
import NotificationsProvider from "./contexts/NotificationsProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#3B3223",
              color: "#ECE7D1",
              borderRadius: "1rem",
              fontSize: "0.875rem",
            },
            success: { iconTheme: { primary: "#8E977D", secondary: "#ECE7D1" } },
            error: { iconTheme: { primary: "#9B4A34", secondary: "#ECE7D1" } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

// One-time cleanup of legacy browser-stored Supabase sessions
try {
  Object.keys(localStorage).filter((k) => k.startsWith("sb-")).forEach((k) => localStorage.removeItem(k));
  Object.keys(sessionStorage).filter((k) => k.startsWith("sb-")).forEach((k) => sessionStorage.removeItem(k));
} catch { /* storage unavailable */ }