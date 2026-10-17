import { useEffect } from "react";
import { runCheck } from "../lib/spendingNotifications";

export function useSpendingNotifications(userId) {
  useEffect(() => {
    if (!userId) return;
    let timer;

    const schedule = () => {
      clearTimeout(timer);
      const next = new Date();
      next.setHours(23, 59, 0, 0);
      if (next <= new Date()) next.setDate(next.getDate() + 1);
      timer = setTimeout(async () => {
        await runCheck(userId);
        schedule();
      }, next - new Date() + 1000);
    };

    const check = () => runCheck(userId);
    const onVisible = () => document.visibilityState === "visible" && check();

    check(); // catches up on a missed day/month when the app opens
    schedule();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pisopath:notify-changed", check);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pisopath:notify-changed", check);
    };
  }, [userId]);
}