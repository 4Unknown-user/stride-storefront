"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VariantStack from "./VariantStack";
import { catalogData, priceOf } from "../../lib/data";

gsap.registerPlugin(ScrollTrigger);

type Product = (typeof catalogData)[number];

// "featured" keeps the curated order from the data file.
const SORTS = {
  featured: { label: "Featured", compare: () => 0 },
  "price-asc": { label: "Price: low to high", compare: (a: Product, b: Product) => priceOf(a) - priceOf(b) },
  "price-desc": { label: "Price: high to low", compare: (a: Product, b: Product) => priceOf(b) - priceOf(a) },
  name: { label: "Name: A to Z", compare: (a: Product, b: Product) => a.title.localeCompare(b.title) },
};

export function CatalogCard({ product, dark = false, as: Title = "h3" }: { product: Product; dark?: boolean; as?: "h2" | "h3" }) {
  const [active, setActive] = useState(0);
  const variant = product.variants[active];
  const href = `/product/${product.id}`;

  return (
    <article
      data-card
      className={`group flex flex-col rounded-2xl p-4 shadow-sm transition-shadow duration-500 hover:shadow-xl md:p-6 ${
        dark ? "bg-ink-raised text-white shadow-black/40 hover:shadow-black/60" : "bg-white"
      }`}
    >
      {/* Hover: shoe lifts and tips forward. The lift is on a wrapper so it never fights GSAP's transforms on the images. */}
      <Link href={href} data-cursor="View" className="relative block">
        <div className="transition-transform duration-500 ease-out group-hover:-translate-y-3 group-hover:-rotate-3 motion-reduce:transition-none">
          <VariantStack
            variants={product.variants}
            active={active}
            title={product.title}
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
            className="aspect-square"
          />
        </div>
      </Link>

      <p className={`mt-5 text-[11px] font-medium uppercase tracking-[0.3em] ${dark ? "text-white/60" : "text-neutral-600"}`}>
        {product.category}
      </p>
      <div className="mt-1.5 flex items-baseline justify-between gap-3">
        <Title className="text-lg font-semibold tracking-tight">
          <Link href={href} className="hover:underline">{product.title}</Link>
        </Title>
        <span className="font-light tabular-nums">{product.price}</span>
      </div>
      <p className={`mt-1 text-sm ${dark ? "text-white/70" : "text-neutral-600"}`}>{variant.color}</p>

      {product.variants.length > 1 && (
        <div className="mt-3 flex gap-2" role="group" aria-label={`${product.title} colour`}>
          {product.variants.map((v, i) => (
            <button
              key={v.src}
              onClick={() => setActive(i)}
              aria-label={v.color}
              aria-pressed={i === active}
              className={`h-7 w-7 rounded-full ${v.swatch} ring-offset-2 transition ${dark ? "ring-offset-ink-raised" : ""} ${
                i === active ? (dark ? "ring-2 ring-white" : "ring-2 ring-black") : "hover:scale-110"
              }`}
            />
          ))}
        </div>
      )}

      <Link
        href={href}
        className={`mt-5 self-start rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
          dark ? "bg-white text-black hover:bg-white/85" : "bg-black text-white hover:bg-neutral-800"
        }`}
      >
        Shop Now
      </Link>
    </article>
  );
}

export default function CatalogGrid({
  products,
  dark = false,
  eyebrow,
  heading,
  intro,
  nav,
  footer,
  id = "catalog",
  level = 2,
  sortable = false,
}: {
  products: Product[];
  dark?: boolean;
  eyebrow?: string;
  heading: string;
  intro?: string;
  nav?: ReactNode;
  footer?: ReactNode;
  id?: string;
  level?: 1 | 2; // 1 when this grid's heading is the page title
  sortable?: boolean;
}) {
  const grid = useRef<HTMLDivElement>(null);
  const [sort, setSort] = useState<keyof typeof SORTS>("featured");
  const sorted = useMemo(() => (sort === "featured" ? products : [...products].sort(SORTS[sort].compare)), [products, sort]);
  const Heading = level === 1 ? "h1" : "h2";

  // Cards rise in a stagger as each row scrolls into view. Only opacity/transform on the <article>,
  // and cleared afterwards so the hover shadow and lift take over cleanly.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      gsap.set(cards, { opacity: 0, y: 48 });
      ScrollTrigger.batch(cards, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, clearProps: "opacity,transform" }),
      });
    }, grid);
    return () => ctx.revert();
  }, [products]);

  return (
    <section id={id} className={`scroll-mt-20 px-6 py-28 md:px-12 md:py-36 ${dark ? "bg-ink text-white" : "bg-canvas"}`}>
      <div className="mx-auto max-w-7xl">
        {eyebrow && (
          <p className={`text-xs font-medium uppercase tracking-[0.4em] ${dark ? "text-white/60" : "text-neutral-600"}`}>{eyebrow}</p>
        )}
        <Heading className="mt-5 max-w-5xl font-serif text-5xl leading-[0.92] tracking-tighter md:text-8xl lg:text-9xl">{heading}</Heading>
        {intro && <p className={`mt-8 max-w-xl text-lg leading-relaxed ${dark ? "text-white/60" : "text-neutral-600"}`}>{intro}</p>}
        {(nav || sortable) && (
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
            {nav}
            {sortable && (
              <label className="ml-auto flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em]">
                <span className={dark ? "text-white/60" : "text-neutral-600"}>Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as keyof typeof SORTS)}
                  className={`rounded-full border bg-transparent py-2.5 pl-4 pr-8 text-xs font-medium uppercase tracking-[0.2em] ${
                    dark ? "border-white/20 [&>option]:text-black" : "border-neutral-300"
                  }`}
                >
                  {Object.entries(SORTS).map(([key, s]) => (
                    <option key={key} value={key}>{s.label}</option>
                  ))}
                </select>
              </label>
            )}
          </div>
        )}

        <div ref={grid} className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {sorted.map((p) => (
            <CatalogCard key={p.id} product={p} dark={dark} as={level === 1 ? "h2" : "h3"} />
          ))}
        </div>

        {footer && <div className="mt-20 flex justify-center">{footer}</div>}
      </div>
    </section>
  );
}
