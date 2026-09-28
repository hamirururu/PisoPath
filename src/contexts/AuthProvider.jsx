import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { AuthContext } from "./auth-context";

// Supabase returns { data, error }. We throw errors so pages can use try/catch.
const unwrap = ({ data, error }) => {
  if (error) throw error;
  return data;
};

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore a saved session (sessions persist in the browser automatically)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Stay in sync with sign in, sign out, token refresh, password recovery
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signUp: async (email, password, fullName) =>
        unwrap(
          await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: fullName },
              emailRedirectTo: window.location.origin,
            },
          })
        ),
      signIn: async (email, password) =>
        unwrap(await supabase.auth.signInWithPassword({ email, password })),
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      },
      sendPasswordReset: async (email) =>
        unwrap(
          await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          })
        ),
      updatePassword: async (password) =>
        unwrap(await supabase.auth.updateUser({ password })),
    }),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}