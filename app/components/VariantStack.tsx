"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

type Variant = { color: string; src: string };

// All variants stacked so every colour is already loaded when a swatch is clicked.
// On change: current shoe shrinks out, then the new one drops in from just above.
export default function VariantStack({
  variants,
  active,
  title,
  sizes,
  priority = false,
  className = "",
}: {
  variants: Variant[];
  active: number;
  title: string;
  sizes: string; // how wide the stack renders, so the right image size is downloaded
  priority?: boolean; // true for the one above-the-fold image on a page (the PDP)
  className?: string;
}) {
  const imgs = useRef<HTMLImageElement[]>([]);
  const prev = useRef(active);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const from = prev.current;
    prev.current = active;
    if (from === active) return;

    // A click mid-swap cancels the running sequence and hides everything but the two shoes involved.
    tl.current?.kill();
    const els = imgs.current;
    els.forEach((el, i) => i !== from && i !== active && gsap.set(el, { opacity: 0 }));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(els[from], { opacity: 0 });
      gsap.set(els[active], { y: 0, scale: 1, opacity: 1 });
      return;
    }
    tl.current = gsap
      .timeline()
      .to(els[from], { scale: 0.8, opacity: 0, duration: 0.2, ease: "power2.in" })
      .fromTo(
        els[active],
        { y: -20, scale: 1.1, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }
      );
  }, [active]);

  return (
    <div className={`relative ${className}`}>
      {variants.map((v, i) => (
        <Image
          key={v.src}
          ref={(el) => {
            if (el) imgs.current[i] = el;
          }}
          src={v.src}
          alt={i === active ? `${title} in ${v.color}` : ""}
          fill
          sizes={sizes}
          priority={priority && i === 0}
          // Keyed to the first variant, not `active`, so React never touches opacity after mount; GSAP owns it.
          style={i === 0 ? undefined : { opacity: 0 }}
          className="object-contain will-change-transform"
        />
      ))}
    </div>
  );
}
