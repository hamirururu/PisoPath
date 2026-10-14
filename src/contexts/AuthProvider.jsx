import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "../lib/api";
import { AuthContext } from "./auth-context";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const lastCheck = useRef(0);

  const refresh = useCallback(async () => {
    lastCheck.current = Date.now();
    try {
      const data = await api.get("/api/auth/me");
      setUser(data.user);
    } catch {
      /* network error: keep current state rather than logging out on a blip */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const onUnauthorized = () => setUser(null);
    const onRefreshUser = () => refresh();
    const onVisible = () => {
      if (document.visibilityState === "visible" && Date.now() - lastCheck.current > 60_000) refresh();
    };
    window.addEventListener("pisopath:unauthorized", onUnauthorized);
    window.addEventListener("pisopath:refresh-user", onRefreshUser);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("pisopath:unauthorized", onUnauthorized);
      window.removeEventListener("pisopath:refresh-user", onRefreshUser);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  const value = useMemo(
    () => ({
      user,
      loading,
      signUp: async (email, password, fullName) => {
        const data = await api.post("/api/auth/signup", { email, password, fullName });
        if (data.status === "signed_in") setUser(data.user);
        return data;
      },
      signIn: async (email, password) => {
        const data = await api.post("/api/auth/login", { email, password });
        setUser(data.user);
      },
      signOut: async () => {
        await api.post("/api/auth/logout").catch(() => {});
        setUser(null);
      },
      sendPasswordReset: (email) => api.post("/api/auth/forgot", { email }),
      updatePassword: (password) => api.post("/api/auth/update-password", { password }),
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}