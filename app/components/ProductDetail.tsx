"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import VariantStack from "./VariantStack";
import Accordion from "./Accordion";
import { useCart } from "./CartProvider";
import { CatalogCard } from "./CatalogGrid";
import { catalogData, productsIn, slugOf } from "../../lib/data";

type Product = (typeof catalogData)[number];

const SIZES = [7, 8, 9, 10, 11, 12];

const DETAILS = [
  {
    title: "Materials & Care",
    body: "Upper in full-grain leather and heavyweight organic cotton canvas, lined with breathable recycled polyester mesh. Natural rubber cupsole, stitched for life. Spot clean with a damp cloth and mild soap; air dry away from direct heat. Never machine wash.",
  },
  {
    title: "Sustainability",
    body: "Leather is sourced from independently audited tanneries, canvas from organic cotton, and 30% of every outsole is reclaimed rubber. Each pair ships in a 100% recycled, plastic-free box. Send your worn pair back and we will resole it or recycle it responsibly.",
  },
  {
    title: "Shipping & Returns",
    body: "Free standard delivery on orders over $75, arriving in 3–5 business days. Express delivery available at checkout. Returns are free within 30 days in unworn condition. Start a return from your order confirmation email.",
  },
];

export default function ProductDetail({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const v = Number(new URLSearchParams(window.location.search).get("v"));
    if (Number.isInteger(v) && v > 0 && v < product.variants.length) setActive(v);
  }, [product]);
  const [size, setSize] = useState<number | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const { add, setOpen } = useCart();
  const variant = product.variants[active];
  // The next three in the same category, wrapping around. Deterministic, so server and client render the same list.
  const siblings = productsIn(product.category);
  const at = siblings.findIndex((p) => p.id === product.id);
  const related = [1, 2, 3].map((k) => siblings[(at + k) % siblings.length]);

  return (
    <main>
      <div className="grid md:grid-cols-2">
        {/* Left: locked in the viewport while the right column scrolls. On mobile it stacks on top. */}
        <div className="relative flex h-[60vh] items-center justify-center bg-white px-8 md:sticky md:top-0 md:h-screen md:px-16">
          <nav aria-label="Breadcrumb" className="absolute left-6 top-20 text-sm md:left-12 md:top-24">
            <Link href="/collections" className="font-medium transition hover:opacity-60">
              ← Back to Collections
            </Link>
            <ol className="mt-1 flex gap-2 text-neutral-600">
              <li><Link href="/collections" className="hover:text-neutral-900">Collections</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href={`/collections/${slugOf(product.category)}`} className="hover:text-neutral-900">{product.category}</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-neutral-900">{product.title}</li>
            </ol>
          </nav>
          <VariantStack
            variants={product.variants}
            active={active}
            title={product.title}
            sizes="(min-width: 768px) 45vw, 90vw"
            priority
            className="aspect-square w-full max-w-2xl"
          />
        </div>

        <div className="flex flex-col px-6 py-12 md:px-16 md:py-32">
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-neutral-600">{product.category}</p>
          <h1 className="mt-4 font-serif text-5xl leading-[0.95] tracking-tighter md:text-7xl">{product.title}</h1>
          <p className="mt-4 text-2xl font-light">{product.price}</p>
          <p className="mt-8 max-w-md leading-relaxed text-neutral-600">{product.description}</p>

          <div className="mt-12">
            <p className="text-sm font-semibold">
              Colour: <span className="font-normal text-neutral-600">{variant.color}</span>
            </p>
            {product.variants.length > 1 && (
              <div className="mt-4 flex gap-3" role="group" aria-label="Colour">
                {product.variants.map((v, i) => (
                  <button
                    key={v.src}
                    onClick={() => setActive(i)}
                    aria-label={v.color}
                    aria-pressed={i === active}
                    className={`h-10 w-10 rounded-full ${v.swatch} ring-offset-2 transition ${
                      i === active ? "ring-2 ring-black" : "hover:scale-110"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mt-12">
            <div className="flex max-w-md items-baseline justify-between">
              <p className="text-sm font-semibold">Select size</p>
              <Link href="/help#sizing" className="text-xs text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline">
                Size guide
              </Link>
            </div>
            {/* Keyed on the error so a repeat miss re-plays the shake. */}
            <div
              key={String(sizeError)}
              className={`mt-4 grid max-w-md grid-cols-3 gap-3 ${sizeError ? "animate-shake" : ""}`}
              role="group"
              aria-label="Size"
              aria-describedby={sizeError ? "size-error" : undefined}
            >
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSize(s);
                    setSizeError(false);
                  }}
                  aria-pressed={s === size}
                  className={`rounded-xl border py-4 text-sm font-medium transition ${
                    s === size
                      ? "border-black bg-black text-white"
                      : sizeError
                        ? "border-red-400 bg-red-50 hover:border-black"
                        : "border-neutral-300 bg-white hover:border-black"
                  }`}
                >
                  US {s}
                </button>
              ))}
            </div>
            {sizeError && (
              <p id="size-error" role="alert" className="mt-3 text-sm text-red-600">
                Please choose a size to continue.
              </p>
            )}
          </div>

          <button
            onClick={() => {
              if (size === null) return setSizeError(true);
              add(product.id, size, active);
              setOpen(true);
            }}
            className="mt-12 w-full max-w-md rounded-full bg-black py-6 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-neutral-800 active:scale-[0.99]"
          >
            {size === null ? "Add to Cart" : `Add to Cart — US ${size}`}
          </button>

          <div className="mt-12 max-w-md">
            <Accordion items={DETAILS} />
          </div>
        </div>
      </div>

      <section className="border-t border-neutral-200 px-6 py-24 md:px-12">
        <h2 className="text-center font-serif text-4xl md:text-6xl">You Might Also Like</h2>
        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-8 lg:grid-cols-3">
          {related.map((p) => (
            <CatalogCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
