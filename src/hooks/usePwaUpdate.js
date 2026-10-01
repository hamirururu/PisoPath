import { useRegisterSW } from "virtual:pwa-register/react";

export function usePwaUpdate() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return;

      setInterval(() => registration.update(), 60 * 60 * 1000); // hourly check

      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          registration.update();
        }
      });
    },
  });

  function reloadNow() {
    updateServiceWorker(true);
  }

  function dismiss() {
    setNeedRefresh(false);
  }

  return { needRefresh, reloadNow, dismiss };
}