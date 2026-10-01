"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import NavTheme from "./NavTheme";
import { shoeData } from "../../lib/data";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Outgoing flies off left, incoming drops in from top-right and snaps to center. Runs together.
// With reduced motion the shoes simply swap.
function useShoeSwap(activeIndex) {
  const imgs = useRef([]);
  const prev = useRef(activeIndex);

  useEffect(() => {
    const from = prev.current;
    prev.current = activeIndex;
    if (from === activeIndex) return;

    const els = imgs.current;
    gsap.killTweensOf(els);
    els.forEach((el, i) => i !== from && i !== activeIndex && gsap.set(el, { opacity: 0 }));
    if (reducedMotion()) {
      gsap.set(els[from], { opacity: 0 });
      gsap.set(els[activeIndex], { x: 0, y: 0, rotation: 0, opacity: 1 });
      return;
    }
    gsap.to(els[from], { x: -600, rotation: -45, opacity: 0, duration: 0.6, ease: "power2.in" });
    gsap.fromTo(
      els[activeIndex],
      { x: 600, y: -400, rotation: 45, opacity: 0 },
      { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.9, ease: "back.out(1.2)" }
    );
  }, [activeIndex]);

  return imgs;
}

const CYCLE_MS = 4000; // time each shoe is shown
const RESUME_MS = 6000; // after a manual pick, hold it a little longer before auto-play continues

function Swatches({ activeIndex, onSelect }) {
  return (
    <div className="flex gap-1" role="group" aria-label="Choose shoe">
      {shoeData.map((s, i) => (
        // The button is a 36px target; the coloured dot inside it is the visual.
        <button key={s.id} onClick={() => onSelect(i)} aria-label={s.title} aria-pressed={i === activeIndex} className="group flex h-9 w-9 items-center justify-center rounded-full">
          <span
            className={`h-6 w-6 rounded-full ${s.swatch} ring-offset-2 ring-offset-transparent transition duration-300 ${
              i === activeIndex ? "scale-110 ring-2 ring-white" : "ring-1 ring-white/40 group-hover:scale-110"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false); // user's explicit choice (or reduced motion)
  const [focusHold, setFocusHold] = useState(false); // keyboard focus is inside the controls
  const imgs = useShoeSwap(activeIndex);
  const nextDelay = useRef(CYCLE_MS);
  const hero = useRef(null);
  const plates = useRef(null);
  const words = useRef(null);
  const stage = useRef(null);

  // Visitors who ask for reduced motion start paused; they can still press play.
  useEffect(() => {
    if (reducedMotion()) setPaused(true);
  }, []);

  // Mouse parallax in three depths: the plate drifts against the cursor, the giant word a little less,
  // and the shoe slightly with it, so the scene reads as layered space. Mouse only; off for reduced motion.
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || reducedMotion()) return;
    const layers = [
      [plates.current, -40, -28],
      [words.current, -16, -10],
      [stage.current, 14, 10],
    ].map(([el, dx, dy]) => ({
      dx,
      dy,
      x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3" }),
      y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3" }),
    }));
    const move = (nx, ny) => layers.forEach((l) => (l.x(nx * l.dx), l.y(ny * l.dy)));
    const onMove = (e) => move(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
    const onLeave = () => move(0, 0);
    const el = hero.current;
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // One timeout per shoe, armed on mount and re-armed on every change. Not gated on mouse hover
  // (a resting cursor used to stall it), but it does stop while paused or while a keyboard user is in the controls.
  useEffect(() => {
    if (paused || focusHold) return;
    const t = setTimeout(() => setActiveIndex((i) => (i + 1) % shoeData.length), nextDelay.current);
    nextDelay.current = CYCLE_MS;
    return () => clearTimeout(t);
  }, [activeIndex, paused, focusHold]);

  const select = (i) => {
    nextDelay.current = RESUME_MS;
    setActiveIndex(i);
  };

  const shoe = shoeData[activeIndex];

  return (
    <section
      ref={hero}
      aria-roledescription="carousel"
      aria-label="Featured drops"
      className="relative flex h-svh min-h-[640px] flex-col overflow-hidden bg-black pt-20 text-white"
    >
      <NavTheme mode="hero" />

      {/* z-0: atmospheric plates, crossfading per shoe. Oversized so the parallax never exposes an edge. */}
      <div ref={plates} aria-hidden="true" className="absolute -inset-[5%] z-0 will-change-transform">
        {shoeData.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none ${
              i === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image src={s.plate} alt="" fill sizes="110vw" quality={80} priority={i === 0} className="animate-drift object-cover" />
          </div>
        ))}
      </div>
      {/* Vignette + bottom shade keep the type readable over the brightest plates. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)),linear-gradient(to_top,rgba(0,0,0,0.75),transparent_45%)]"
      />

      {/* z-10: giant background word. */}
      <div ref={words} aria-hidden="true" className="absolute inset-0 z-10">
        {shoeData.map((s, i) => (
          <span
            key={s.id}
            className={`absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-serif text-[20vw] leading-none tracking-tighter text-white/[0.07] transition-opacity duration-700 ${
              i === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            {s.word}
          </span>
        ))}
      </div>

      {/* z-20: the shoe, in front of everything. Fixed-size wrapper so every PNG renders at the same size and position. */}
      <div ref={stage} className="relative z-20 flex flex-1 items-center justify-center px-4">
        <div className="relative aspect-[558/447]" style={{ width: "min(90vw, calc((100svh - 330px) * 1.25), 860px)" }}>
          <div aria-hidden="true" className="absolute inset-x-[15%] bottom-[2%] h-[8%] rounded-[50%] bg-black/60 blur-2xl" />
          {shoeData.map((s, i) => (
            <Image
              key={s.id}
              ref={(el) => {
                imgs.current[i] = el;
              }}
              src={s.src}
              alt={i === activeIndex ? `${s.title} in ${s.subtitle}` : ""}
              fill
              sizes="(min-width: 1024px) 860px, 90vw"
              priority={i === 0}
              // Keyed to the first shoe, not activeIndex: React never touches opacity after mount; GSAP owns it.
              style={i === 0 ? undefined : { opacity: 0 }}
              className="object-contain will-change-transform"
            />
          ))}
        </div>
      </div>

      <div
        onFocus={() => setFocusHold(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocusHold(false)}
        className="relative z-20 flex flex-col items-center gap-6 px-6 pb-8 text-center md:flex-row md:items-end md:justify-between md:px-12 md:pb-10 md:text-left"
      >
        {/* Not a live region: auto-advancing slides must not interrupt screen readers. */}
        <div key={activeIndex} className="max-w-sm animate-rise">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-white/70">
            Drop {String(activeIndex + 1).padStart(2, "0")} / {String(shoeData.length).padStart(2, "0")}
          </p>
          <h1 className="mt-3 font-serif text-5xl leading-none tracking-tight md:text-6xl">{shoe.title}</h1>
          <p className="mt-3 hidden text-sm leading-relaxed text-white/75 sm:block">{shoe.desc}</p>
        </div>

        <div className="flex flex-col items-center gap-4 md:items-end">
          <div className="flex items-center gap-3">
            <span key={activeIndex} className="animate-rise text-xs uppercase tracking-[0.3em] text-white/75">
              {shoe.subtitle}
            </span>
            <Swatches activeIndex={activeIndex} onSelect={select} />
            <button
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play slideshow" : "Pause slideshow"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 transition hover:border-white hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                {paused ? <path d="M7 4v16l13-8L7 4Z" /> : <path d="M6 4h4v16H6zM14 4h4v16h-4z" />}
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-5">
            <span key={activeIndex} className="animate-rise font-serif text-3xl">{shoe.price}</span>
            <Link
              href={shoe.href}
              className="rounded-full bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-900 transition hover:bg-white/85 active:scale-[0.98]"
            >
              Shop now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
