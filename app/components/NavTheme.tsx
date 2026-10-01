"use client";

import { useEffect } from "react";

// Tells the fixed Navbar what it sits on, via <html data-nav>:
//   "hero" - dark hero behind it at the top of the page only (goes light once scrolled onto the page)
//   "dark" - the whole page is dark
export default function NavTheme({ mode }: { mode: "hero" | "dark" }) {
  useEffect(() => {
    document.documentElement.dataset.nav = mode;
    return () => {
      delete document.documentElement.dataset.nav;
    };
  }, [mode]);
  return null;
}
