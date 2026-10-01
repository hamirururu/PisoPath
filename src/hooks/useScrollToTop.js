import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router keeps the window scroll position across route changes, so a page
// reached from a notification (or any in-app link) can land mid-scroll with the
// header off-screen. Reset on pathname change only — a search-param change like
// ?page=2 shouldn't yank the user back to the top.
export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
}