"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import { useModal } from "./useModal";
import Thumb from "./Thumb";
import { money, FREE_SHIPPING_FROM } from "../../lib/checkout";

export function QtyStepper({ qty, onChange, label }: { qty: number; onChange: (q: number) => void; label: string }) {
  return (
    <div className="flex items-center rounded-full border border-neutral-300" role="group" aria-label={`Quantity for ${label}`}>
      <button onClick={() => onChange(qty - 1)} aria-label="Decrease quantity" className="h-9 w-9 rounded-full text-lg leading-none transition hover:bg-neutral-100">
        −
      </button>
      <span className="w-6 text-center text-sm tabular-nums">{qty}</span>
      <button onClick={() => onChange(qty + 1)} aria-label="Increase quantity" disabled={qty >= 10} className="h-9 w-9 rounded-full text-lg leading-none transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40">
        +
      </button>
    </div>
  );
}

export default function CartDrawer() {
  const { open, setOpen, lines, subtotal, count, setQty, remove } = useCart();
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  useModal(open, () => setOpen(false), root);

  const toFreeShipping = FREE_SHIPPING_FROM - subtotal;

  return (
    <div ref={root} className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        inert={!open}
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-canvas shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
          <h2 className="text-xs font-medium uppercase tracking-[0.35em]">
            Your bag <span className="text-neutral-600">({count})</span>
          </h2>
          <button data-autofocus onClick={() => setOpen(false)} aria-label="Close bag" className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-2xl leading-none transition hover:bg-neutral-200">
            ×
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <svg viewBox="0 0 24 24" className="h-12 w-12 text-neutral-300" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
              <path d="M5 8h14l-1 12H6L5 8Z" strokeLinejoin="round" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
            </svg>
            <p className="mt-6 font-serif text-3xl tracking-tight">Your bag is empty</p>
            <p className="mt-2 text-sm text-neutral-600">Every pair starts somewhere. Start here.</p>
            <Link
              href="/collections"
              onClick={() => setOpen(false)}
              className="mt-8 rounded-full bg-black px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800"
            >
              Explore the collection
            </Link>
          </div>
        ) : (
          <>
            {/* Free-shipping nudge with a progress bar. */}
            <div className="border-b border-neutral-200 px-6 py-4 text-xs text-neutral-600">
              {toFreeShipping > 0 ? (
                <>You're <span className="font-semibold text-neutral-900">{money(toFreeShipping)}</span> away from free shipping.</>
              ) : (
                <>You've unlocked <span className="font-semibold text-neutral-900">free standard shipping</span>.</>
              )}
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-neutral-200">
                <div
                  className="h-full rounded-full bg-black transition-[width] duration-700"
                  style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_FROM) * 100)}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-neutral-200 overflow-y-auto px-6">
              {lines.map((l) => (
                <li key={l.key} className="flex gap-4 py-5">
                  <Link href={`/product/${l.id}`} onClick={() => setOpen(false)} className="h-24 w-24 shrink-0 rounded-xl bg-white p-2">
                    <Thumb src={l.variant.src} px={160} className="h-full w-full" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <Link href={`/product/${l.id}`} onClick={() => setOpen(false)} className="font-semibold tracking-tight hover:underline">
                        {l.product.title}
                      </Link>
                      <span className="text-sm tabular-nums">{money(l.lineTotal)}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-600">{l.variant.color} · US {l.size}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QtyStepper qty={l.qty} onChange={(q) => setQty(l.key, q)} label={l.product.title} />
                      <button onClick={() => remove(l.key)} className="text-xs text-neutral-600 underline-offset-4 transition hover:text-neutral-900 hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-neutral-200 bg-white px-6 py-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-semibold tabular-nums">{money(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-neutral-600">Shipping and taxes calculated at checkout.</p>
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/checkout");
                }}
                className="mt-5 w-full rounded-full bg-black py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-neutral-800"
              >
                Proceed to Checkout
              </button>
              <button onClick={() => setOpen(false)} className="mt-3 w-full py-2 text-xs text-neutral-600 transition hover:text-neutral-900">
                Continue shopping
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
