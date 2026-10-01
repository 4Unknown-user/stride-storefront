"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// A template (unlike a layout) remounts on every navigation, so this runs once per route change.
// Survives across client navigations; false only for the very first page load.
let navigated = false;

export default function Template({ children }) {
  const page = useRef(null);
  // Captured at render so React strict mode re-running the effect still sees this as the first load.
  const firstLoad = useRef(!navigated);

  // Layout effect: hide the new page before the browser paints it, then let it materialise.
  useLayoutEffect(() => {
    navigated = true;
    // No transition on first load (the server-rendered page is already visible) or for reduced-motion users.
    if (firstLoad.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.fromTo(
      page.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        // The transform must not outlive the tween: on an ancestor it would break ScrollTrigger pins
        // and position: fixed. Pins measured during the drift are 20px off, so re-measure once it lands.
        clearProps: "opacity,transform",
        onComplete: () => ScrollTrigger.refresh(),
      }
    );
    return () => tween.kill();
  }, []);

  return (
    <div ref={page} id="content" tabIndex={-1} className="outline-none">
      {children}
    </div>
  );
}
