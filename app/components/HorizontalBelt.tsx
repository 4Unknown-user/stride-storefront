"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { catalogData } from "../../lib/data";

gsap.registerPlugin(ScrollTrigger);

// Every product. The track pads half a screen at each end, so the first and last shoe sit centred:
// no empty gaps and no need to duplicate the array.
const beltItems = catalogData;
const SCROLL_RATIO = 0.6; // px of page scroll per px of track travel; < 1 keeps a 21-shoe pin from dragging on
const FALLOFF = 500; // px from centre at which a shoe reaches its edge pose

// dist = shoe centre minus screen centre, in px. Squared t gives a smooth curve through the peak.
function dialPose(dist: number) {
  const t = Math.min(Math.abs(dist) / FALLOFF, 1);
  return {
    y: 150 * t * t,
    scale: 1.3 - 0.7 * t * t,
    opacity: 1 - 0.6 * t,
    rotation: 30 * t * Math.sign(dist),
  };
}

export default function HorizontalBelt() {
  const outer = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const slots = useRef<HTMLDivElement[]>([]);
  const shoes = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trackEl = track.current!;
      const distance = () => trackEl.scrollWidth - window.innerWidth;

      // Measure the slots (which only translate with the track), then pose the shoes inside them.
      // Measuring the transformed shoe itself would feed its own rotation/scale back into the maths.
      const updateDial = () => {
        const centre = window.innerWidth / 2;
        const dists = slots.current.map((el) => {
          const r = el.getBoundingClientRect();
          return r.left + r.width / 2 - centre;
        });
        dists.forEach((d, i) => gsap.set(shoes.current[i], dialPose(d)));
      };

      gsap.to(trackEl, {
        xPercent: () => (-distance() / trackEl.scrollWidth) * 100,
        ease: "none",
        // On the tween, not the ScrollTrigger, so it runs after the track has moved on every frame.
        onUpdate: updateDial,
        scrollTrigger: {
          trigger: outer.current,
          pin: true,
          scrub: true,
          start: "top top",
          end: () => `+=${distance() * SCROLL_RATIO}`,
          invalidateOnRefresh: true,
          onRefresh: updateDial,
        },
      });
      updateDial();
    }, outer);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={outer} data-cursor="Scroll" className="flex h-screen flex-col justify-center overflow-hidden bg-canvas">
      <p className="text-center text-xs font-medium uppercase tracking-[0.4em] text-neutral-600">The Discovery Dial</p>
      <h2 className="mt-4 text-center text-4xl font-black tracking-tighter md:text-7xl">SCROLL TO DISCOVER</h2>
      {/* Side padding = half a screen minus half a slot, so the first and last shoe can sit dead centre. */}
      <div ref={track} className="mt-16 flex w-max px-[calc(50vw-8rem)] md:px-[calc(50vw-12rem)]">
        {beltItems.map((p, i) => (
          <div
            key={p.id}
            ref={(el) => {
              if (el) slots.current[i] = el;
            }}
            className="mx-10 w-44 shrink-0 md:mx-16 md:w-64"
          >
            <Link href={`/product/${p.id}`} data-cursor="View" className="block">
              <Image
                ref={(el) => {
                  if (el) shoes.current[i] = el;
                }}
                src={p.variants[0].src}
                alt={p.title}
                width={558}
                height={447}
                sizes="(min-width: 768px) 340px, 230px"
                className="aspect-[558/447] w-full object-contain will-change-transform"
              />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
