"use client";

import { useEffect, type RefObject } from "react";

// Shared behaviour for every overlay (bag drawer, mobile menu, search):
//  - everything else on the page becomes inert, so Tab and screen readers stay inside the dialog
//  - Escape closes it, the page behind can't scroll
//  - focus moves in on open and returns to whatever opened it on close
// `root` must be the overlay's outermost element and a direct child of <body>.
export function useModal(open: boolean, onClose: () => void, root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!open || !el) return;

    const opener = document.activeElement as HTMLElement | null;
    const others = Array.from(document.body.children).filter(
      // Live regions stay reachable so announcements (e.g. bag updates) still fire while a dialog is open.
      (c): c is HTMLElement => c instanceof HTMLElement && c !== el && !c.inert && !c.hasAttribute("aria-live")
    );
    others.forEach((c) => (c.inert = true));

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);

    (el.querySelector<HTMLElement>("[data-autofocus]") ?? el.querySelector<HTMLElement>("button, a, input"))?.focus();

    return () => {
      others.forEach((c) => (c.inert = false));
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
    // onClose is intentionally not a dependency: callers pass inline closures, and re-running would steal focus.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, root]);
}
