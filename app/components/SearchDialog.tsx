"use client";

import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useModal } from "./useModal";
import Thumb from "./Thumb";
import { catalogData, categories } from "../../lib/data";

// Instant client-side search over the catalogue (title, category, colourways).
// ponytail: substring match over ~20 products. Move to a search index/API when the catalogue outgrows the bundle.
function search(query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return catalogData.filter((p) => {
    const haystack = [p.title, p.category, ...p.variants.map((v) => v.color)].join(" ").toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
}

export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const results = useMemo(() => search(query), [query]);
  useModal(open, onClose, root);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div ref={root} className={`fixed inset-0 z-[90] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        inert={!open}
        className={`absolute inset-x-0 top-0 max-h-svh overflow-y-auto bg-canvas shadow-2xl transition duration-300 ease-out ${
          open ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-4xl px-6 pb-10 pt-6">
          <div className="flex items-center gap-4 border-b border-neutral-900 pb-4">
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <label htmlFor="site-search" className="sr-only">Search products</label>
            <input
              id="site-search"
              data-autofocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sneakers, colours, collections"
              autoComplete="off"
              className="w-full bg-transparent font-serif text-2xl tracking-tight outline-none placeholder:text-neutral-500 md:text-3xl"
            />
            <button onClick={onClose} aria-label="Close search" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl leading-none transition hover:bg-neutral-200">
              ×
            </button>
          </div>

          {/* Announced politely so screen-reader users hear the result count as they type. */}
          <p role="status" className="mt-6 text-xs font-medium uppercase tracking-[0.3em] text-neutral-600">
            {query.trim() === "" ? "Popular" : results.length === 0 ? `No results for “${query.trim()}”` : `${results.length} ${results.length === 1 ? "result" : "results"}`}
          </p>

          {query.trim() === "" ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/collections/${c.slug}`} onClick={onClose} className="block rounded-full border border-neutral-300 px-5 py-2.5 text-sm transition hover:border-black">
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/collections" onClick={onClose} className="block rounded-full border border-neutral-300 px-5 py-2.5 text-sm transition hover:border-black">
                  All styles
                </Link>
              </li>
            </ul>
          ) : results.length === 0 ? (
            <p className="mt-4 text-neutral-600">
              Try a colour (“navy”), a material (“velvet”) or a collection (“luxury”), or{" "}
              <Link href="/collections" onClick={onClose} className="underline underline-offset-4">browse everything</Link>.
            </p>
          ) : (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {results.slice(0, 8).map((p) => (
                <li key={p.id}>
                  <Link href={`/product/${p.id}`} onClick={onClose} className="flex items-center gap-4 rounded-2xl bg-white p-3 shadow-sm transition-shadow hover:shadow-lg">
                    <Thumb src={p.variants[0].src} px={128} className="h-16 w-16 shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold tracking-tight">{p.title}</span>
                      <span className="block text-sm text-neutral-600">{p.category} · {p.variants[0].color}</span>
                    </span>
                    <span className="font-light tabular-nums">{p.price}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
