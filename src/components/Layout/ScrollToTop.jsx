import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Renders nothing. Runs on every route change and forces the window
// back to the top, so navigating to a new page never inherits the
// scroll position left over from the page you came from.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" in window.HTMLElement.prototype ? "instant" : "auto" });
  }, [pathname]);

  return null;
}
