"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// A trailing dot that swells into a labelled disc over anything marked data-cursor="<label>".
// Mouse/trackpad only: touch devices never see it, and the native cursor stays everywhere except labelled targets.
export default function Cursor() {
  const el = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const node = el.current!;
    const xTo = gsap.quickTo(node, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(node, "y", { duration: 0.35, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      gsap.to(node, { opacity: 1, duration: 0.2, overwrite: "auto" });
      xTo(e.clientX);
      yTo(e.clientY);
      const target = (e.target as Element).closest?.("[data-cursor]");
      setLabel(target ? target.getAttribute("data-cursor") : null);
    };
    const onLeave = () => gsap.to(node, { opacity: 0, duration: 0.2 });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  if (!enabled) return <div ref={el} hidden />;

  return (
    <div
      ref={el}
      aria-hidden="true"
      // Blend on this outer div: it carries GSAP's transform, so it is the stacking context that meets the page.
      className={`pointer-events-none fixed left-0 top-0 z-[70] opacity-0 ${label ? "" : "mix-blend-difference"}`}
      style={{ transform: "translate(-100px, -100px)" }}
    >
      {/* Centred on the pointer; only this inner disc changes size, so GSAP's x/y on the outer div never conflict. */}
      <div
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[11px] font-semibold uppercase tracking-[0.25em] transition-[width,height,background-color] duration-300 ease-out ${
          label ? "h-20 w-20 bg-white text-black shadow-lg ring-1 ring-black/5" : "h-2.5 w-2.5 bg-white"
        }`}
      >
        {label && <span className="animate-rise">{label}</span>}
      </div>
    </div>
  );
}
