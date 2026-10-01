"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Drifts its children vertically while the block crosses the viewport.
// speed = % of own height travelled each way; negative moves against the scroll.
export default function Parallax({ speed = 15, className = "", children }: { speed?: number; className?: string; children: ReactNode }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap.fromTo(
      el.current,
      { yPercent: -speed },
      {
        yPercent: speed,
        ease: "none",
        scrollTrigger: { trigger: el.current, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [speed]);

  return (
    <div ref={el} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
