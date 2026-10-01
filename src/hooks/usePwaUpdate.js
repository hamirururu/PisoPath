import { useRegisterSW } from "virtual:pwa-register/react";

// Watches for a newer build and exposes a prompt so the user can apply it.
// The service worker keeps the old version cached until told to reload, which
// is what makes a safe, non-destructive "new version ready" flow possible.
export function usePwaUpdate() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return;

      // Check periodically and whenever the app comes back to the foreground,
      // so an update lands soon after a deploy without polling while hidden.
      const interval = setInterval(() => registration.update(), 60 * 60 * 1000);
      const onVisible = () => {
        if (document.visibilityState === "visible") registration.update();
      };
      document.addEventListener("visibilitychange", onVisible);

      // Only runs for the lifetime of the registration, but clear up anyway so
      // StrictMode's double-invoke (and any remount) can't stack intervals.
      return () => {
        clearInterval(interval);
        document.removeEventListener("visibilitychange", onVisible);
      };
    },
  });

  function reloadNow() {
    updateServiceWorker(true);
  }

  // Keep the prompt dismissed for this session only; the next deploy sets it again.
  function dismiss() {
    setNeedRefresh(false);
  }

  return { needRefresh, reloadNow, dismiss };
}