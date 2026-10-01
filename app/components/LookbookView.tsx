"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NavTheme from "./NavTheme";
import Thumb from "./Thumb";
import { productById } from "../../lib/data";

gsap.registerPlugin(ScrollTrigger);

type Scene = {
  n: string;
  name: string;
  img: string;
  alt: string;
  place: string;
  story: string;
  product: string;
  variant?: number; // colourway worn in the shot
  spot: [number, number]; // hotspot position over the worn shoe, % of the image
};

const SCENES: Scene[] = [
  {
    n: "01", name: "Neon Alley", img: "/lookbook-1.png", product: "collab-bat", spot: [34, 82],
    alt: "Man in black cargo trousers and armoured black boots sitting on a wet step in a neon-lit alley at night",
    place: "Shinjuku, 2:14 am",
    story: "Rain on the kanji signs, steam from a grate, and a pair of boots built like armour. He waited out the storm. They didn't notice it.",
  },
  {
    n: "02", name: "Golden Hour", img: "/lookbook-milano.png", product: "style-minimal", variant: 0, spot: [58, 62],
    alt: "White leather sneakers with gum soles crossed on a glass table in a penthouse at sunset",
    place: "Sixty floors up, 7:48 pm",
    story: "Linen, marble and the last light over the city. The quietest shoe in the collection, in the loudest light of the day.",
  },
  {
    n: "03", name: "Arc Light", img: "/lookbook-3.png", product: "collab-iron", spot: [56, 76],
    alt: "Red and gold armoured high-tops with a glowing core, worn on a concrete ledge in a graffiti-covered alley",
    place: "Loading dock, 6:02 am",
    story: "Brick, rust and one glowing core. Candy-red plating that turns a service alley into an origin story.",
  },
  {
    n: "04", name: "The Courtyard", img: "/lookbook-4.png", product: "style-suede", spot: [38, 84],
    alt: "Olive suede sneakers with linen trousers on a sunlit brick courtyard lined with terracotta pots",
    place: "A garden in Florence, 11:30 am",
    story: "Old brick, terracotta and olive suede. Sunday shoes for people who don't believe in Sunday best.",
  },
  {
    n: "05", name: "Fire Escape", img: "/lookbook-5.png", product: "collab-panther", spot: [47, 74],
    alt: "Black sneakers with violet light lines and silver claw eyelets, worn on a steel fire escape above a rainy city street",
    place: "Downtown, 11:59 pm",
    story: "Steel grating, city haze, violet light. The last scene of the night, and the first thing anyone looks at.",
  },
];

const productHref = (id: string, variant = 0) => `/product/${id}${variant ? `?v=${variant}` : ""}`;

// Headline reveal mask. Each WORD is one unbreakable inline-block (so lines only ever wrap between words,
// never mid-word), and its mask is padded top and bottom so ascenders and descenders (g, y, p) aren't clipped.
// The negative margins give that padding back, so the heading keeps its tight editorial leading.
function SplitWords({ text }: { text: string }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, w) => (
          <span key={w}>
            {w > 0 && " "}
            <span className="-my-[0.2em] inline-block overflow-hidden whitespace-nowrap py-[0.2em] align-bottom">
              {word.split("").map((c, i) => (
                <span key={i} data-char className="inline-block will-change-transform">
                  {c}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}

// A pulsing dot on the worn shoe that opens into a product card on hover or keyboard focus.
function Hotspot({ scene }: { scene: Scene }) {
  const p = productById(scene.product)!;
  const v = p.variants[scene.variant ?? 0];
  const right = scene.spot[0] > 55; // open the card away from the nearest edge
  return (
    <Link
      href={productHref(scene.product, scene.variant)}
      data-cursor="Shop"
      aria-label={`Shop the story: ${p.title} in ${v.color}, ${p.price}`}
      className="group absolute z-20"
      style={{ left: `${scene.spot[0]}%`, top: `${scene.spot[1]}%` }}
    >
      <span className="absolute -left-3 -top-3 h-6 w-6 animate-ping rounded-full bg-white/60 motion-reduce:animate-none" />
      <span className="absolute -left-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-semibold text-black shadow-lg">+</span>
      {/* Opens upward: the frame clips overflow and the shoes sit low in every shot. */}
      <span
        className={`pointer-events-none absolute bottom-5 flex w-64 translate-y-2 items-center gap-3 rounded-2xl bg-white/95 p-3 text-black opacity-0 shadow-2xl backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 ${
          right ? "right-0" : "left-0"
        }`}
      >
        <Thumb src={v.src} px={112} className="h-14 w-14 shrink-0" />
        <span className="min-w-0">
          <span className="block text-[11px] uppercase tracking-[0.25em] text-neutral-600">Shop the story</span>
          <span className="block text-sm font-semibold leading-snug tracking-tight">{p.title}</span>
          <span className="block text-xs text-neutral-600">{v.color} · {p.price}</span>
        </span>
      </span>
    </Link>
  );
}

// Story + "Shop the Story" card with a colourway picker. Picking a colourway swaps the card in place
// and points its link at that colourway's product page.
function Caption({ scene }: { scene: Scene }) {
  const p = productById(scene.product)!;
  const [vi, setVi] = useState(scene.variant ?? 0);
  const v = p.variants[vi];
  const single = p.variants.length === 1;

  return (
    <div>
      <p data-reveal className="text-xs font-medium uppercase tracking-[0.4em] text-white/60">{scene.place}</p>
      <p data-reveal className="mt-6 font-serif text-3xl leading-snug tracking-tight md:text-4xl">{scene.story}</p>

      <div data-reveal className="mt-10 max-w-md">
        <Link
          href={productHref(p.id, vi)}
          data-cursor="Shop"
          className="group flex items-center gap-5 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/10 hover:ring-white/30"
        >
          <Thumb
            key={v.src}
            src={v.src}
            px={160}
            className="h-20 w-20 shrink-0 animate-rise transition-transform duration-500 group-hover:-translate-y-1 group-hover:-rotate-6"
          />
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] uppercase tracking-[0.3em] text-white/60">Shop the story</span>
            <span className="mt-1 block text-lg font-semibold leading-snug tracking-tight">{p.title}</span>
            <span className="block text-sm leading-snug text-white/70">
              {v.color} · {p.price}
            </span>
          </span>
          <span aria-hidden="true" className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.3em] text-white/60">{single ? "Colourway" : "Colourways"}</span>
          <div className="flex gap-2" role="group" aria-label={`${p.title} colourways`}>
            {p.variants.map((c, i) => (
              <button
                key={c.src}
                type="button"
                onClick={() => setVi(i)}
                aria-pressed={i === vi}
                aria-label={c.color}
                title={c.color}
                className={`h-11 w-11 rounded-lg bg-white/5 p-1 ring-1 transition ${
                  i === vi ? "ring-white" : "ring-white/15 hover:ring-white/50"
                }`}
              >
                <Thumb src={c.src} px={88} className="h-full w-full" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// The photo in its frame. data-scale drives the reveal; data-parallax the drift. Slight overscan hides edge artefacts.
function Photo({ scene, className, sizes }: { scene: Scene; className: string; sizes: string }) {
  return (
    <div data-scale className={`relative overflow-hidden ${className}`}>
      <div data-parallax className="absolute -inset-x-[1.5%] -inset-y-[8%]">
        <Image src={scene.img} alt={scene.alt} fill sizes={sizes} quality={90} className="object-cover" />
      </div>
      <Hotspot scene={scene} />
    </div>
  );
}

function SceneHeading({ scene, className = "" }: { scene: Scene; className?: string }) {
  return (
    <div className={`flex items-end justify-between gap-6 ${className}`}>
      <h2 data-chapter-title className="py-2 font-serif text-5xl leading-[0.95] tracking-tighter sm:text-6xl md:text-[8vw]">
        <SplitWords text={scene.name} />
      </h2>
      <p className="shrink-0 pb-3 font-serif text-2xl text-white/45 md:text-4xl">{scene.n}</p>
    </div>
  );
}

// Each section is an opaque layer stacked above the one before it, so nothing earlier can show through.
const Layer = ({ z, className = "", children }: { z: number; className?: string; children: ReactNode }) => (
  <section className={`relative overflow-hidden bg-ink ${className}`} style={{ zIndex: z }}>
    {children}
  </section>
);

export default function LookbookView() {
  const root = useRef<HTMLElement>(null);

  // Layout effect: from-states are applied before first paint, so nothing flashes in its final state first.
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-cover]", { scale: 1.15, opacity: 0 }, { scale: 1, opacity: 1, duration: 2, ease: "expo.out", lazy: false });
      gsap.from("[data-hero] [data-char]", { yPercent: 115, duration: 1.2, ease: "expo.out", stagger: 0.045, delay: 0.3, lazy: false });
      gsap.from("[data-hero-sub]", { opacity: 0, y: 24, duration: 1, delay: 0.9, stagger: 0.15, ease: "power3.out", lazy: false });

      gsap.utils.toArray<HTMLElement>("[data-chapter-title]").forEach((title) => {
        gsap.from(title.querySelectorAll("[data-char]"), {
          yPercent: 115,
          duration: 1,
          ease: "expo.out",
          stagger: 0.035,
          lazy: false,
          scrollTrigger: { trigger: title, start: "top 88%" },
        });
      });

      // Subtle scale reveal: each frame settles from 1.08 and a soft inset as it scrolls into view.
      gsap.utils.toArray<HTMLElement>("[data-scale]").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.08, opacity: 0.2, clipPath: "inset(6% 6% 6% 6% round 28px)" },
          { scale: 1, opacity: 1, clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.out", scrollTrigger: { trigger: el, start: "top 95%", end: "top 35%", scrub: true } }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });

      gsap.set("[data-reveal]", { opacity: 0, y: 40 });
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 92%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.12, overwrite: true }),
      });
    }, root);

    // Re-measure once everything has painted and each photo has loaded, so trigger points match the final layout.
    const refresh = () => ScrollTrigger.refresh();
    const raf = requestAnimationFrame(refresh);
    const imgs = Array.from(root.current!.querySelectorAll("img")).filter((img) => !img.complete);
    imgs.forEach((img) => img.addEventListener("load", refresh, { once: true }));
    window.addEventListener("load", refresh, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      imgs.forEach((img) => img.removeEventListener("load", refresh));
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, []);

  const [s1, s2, s3, s4, s5] = SCENES;

  return (
    <main ref={root} className="bg-ink text-white">
      <NavTheme mode="dark" />

      {/* Cover. min-h, not h: the title block can always grow, so it's never cut off on short screens. */}
      <Layer z={0} className="flex min-h-svh items-end pt-32">
        <div data-cover className="absolute inset-0">
          <Image src="/lookbook-milano.png" alt="" fill priority sizes="100vw" quality={90} className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-black/50 to-black/30" />
        </div>
        <div data-hero className="relative w-full px-6 pb-14 md:px-12 md:pb-20">
          <p data-hero-sub className="text-xs font-medium uppercase tracking-[0.5em] text-white/60">Lookbook · Season 27 · Five scenes</p>
          <h1 className="mt-6 py-2 font-serif text-[19vw] leading-[0.9] tracking-tighter md:text-[14vw]">
            <SplitWords text="After" />
            <br />
            <span className="italic">
              <SplitWords text="Hours" />
            </span>
          </h1>
          <div data-hero-sub className="mt-10 flex flex-col justify-between gap-6 border-t border-white/20 pt-6 md:flex-row md:items-end">
            <p className="max-w-md text-lg leading-relaxed text-white/70">
              Five cities, one long night. Candid scenes shot on film, from a neon alley at 2am to the last light over the skyline.
            </p>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Scroll ↓</p>
          </div>
        </div>
      </Layer>

      {/* 01: image left, caption right */}
      <Layer z={10} className="py-24 md:py-40">
        <SceneHeading scene={s1} className="px-6 md:px-12" />
        <div className="mt-12 grid items-center gap-12 px-6 md:mt-16 md:grid-cols-12 md:px-12">
          <Photo scene={s1} className="aspect-[827/680] rounded-sm md:col-span-7" sizes="(min-width: 768px) 58vw, 100vw" />
          <div className="md:col-span-5 lg:col-span-4 lg:col-start-9"><Caption scene={s1} /></div>
        </div>
      </Layer>

      {/* 02: edge to edge */}
      <Layer z={20} className="py-24 md:py-40">
        <SceneHeading scene={s2} className="px-6 md:px-12" />
        <Photo scene={s2} className="mt-12 aspect-[4/5] sm:aspect-[16/9] md:mt-16" sizes="100vw" />
        <div className="mx-auto mt-16 max-w-3xl px-6"><Caption scene={s2} /></div>
      </Layer>

      {/* 03: caption left, image right */}
      <Layer z={30} className="py-24 md:py-40">
        <SceneHeading scene={s3} className="px-6 md:px-12" />
        <div className="mt-12 grid items-center gap-12 px-6 md:mt-16 md:grid-cols-12 md:px-12">
          <div className="order-2 md:order-1 md:col-span-5 lg:col-span-4"><Caption scene={s3} /></div>
          <Photo scene={s3} className="order-1 aspect-[866/648] rounded-sm md:order-2 md:col-span-7 lg:col-start-6" sizes="(min-width: 768px) 58vw, 100vw" />
        </div>
      </Layer>

      {/* 04: wide inset */}
      <Layer z={40} className="py-24 md:py-40">
        <SceneHeading scene={s4} className="mx-auto max-w-6xl px-6" />
        <div className="mx-auto mt-12 max-w-6xl md:mt-16 md:px-6">
          <Photo scene={s4} className="aspect-[1024/572] md:rounded-sm" sizes="(min-width: 1152px) 1152px, 100vw" />
        </div>
        <div className="mx-auto mt-16 max-w-3xl px-6"><Caption scene={s4} /></div>
      </Layer>

      {/* 05: wide inset */}
      <Layer z={50} className="py-24 md:py-40">
        <SceneHeading scene={s5} className="px-6 md:px-12" />
        <div className="mx-auto mt-12 max-w-7xl md:mt-16 md:px-6">
          <Photo scene={s5} className="aspect-[1024/572] md:rounded-sm" sizes="(min-width: 1280px) 1280px, 100vw" />
        </div>
        <div className="mx-auto mt-16 max-w-3xl px-6"><Caption scene={s5} /></div>
      </Layer>

      {/* Close */}
      <Layer z={60} className="flex min-h-[80svh] flex-col items-center justify-center px-6 py-24 text-center">
        <p data-reveal className="text-xs font-medium uppercase tracking-[0.5em] text-white/60">End of season</p>
        <h2 data-chapter-title className="mt-6 py-2 font-serif text-6xl leading-[0.95] tracking-tighter sm:text-7xl md:text-[9vw]">
          <SplitWords text="Walk it in." />
        </h2>
        <div data-reveal className="mt-12 flex flex-wrap justify-center gap-3">
          <Link href="/collections" className="rounded-full bg-white px-10 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-white/85">
            Shop the collection
          </Link>
          <Link href="/our-story" className="rounded-full border border-white/30 px-10 py-4 text-xs font-semibold uppercase tracking-[0.25em] transition hover:border-white">
            Our story
          </Link>
        </div>
      </Layer>
    </main>
  );
}
