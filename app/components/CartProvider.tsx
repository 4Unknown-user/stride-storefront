"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { productById, priceOf } from "../../lib/data";

type Item = { id: string; variant: number; size: number; qty: number };
type Product = NonNullable<ReturnType<typeof productById>>;
type Variant = Product["variants"][number];
// On a line, `variant` is the resolved colourway object rather than the stored index.
export type Line = Omit<Item, "variant"> & { key: string; product: Product; variant: Variant; unit: number; lineTotal: number };

type Cart = {
  ready: boolean; // false until the saved cart has been read, so pages don't flash an empty state
  lines: Line[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (id: string, size: number, variant?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<Cart | null>(null);
const KEY = "stride-cart";
const MAX_QTY = 10;
const keyOf = (i: Pick<Item, "id" | "variant" | "size">) => `${i.id}|${i.variant}|${i.size}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  // Load after mount (the server has no localStorage). Storage can throw in private modes; the cart then just doesn't persist.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      // Carts saved before colourways existed have no variant; treat them as the first colourway.
      if (Array.isArray(saved)) setItems(saved.filter((i) => productById(i.id)).map((i) => ({ variant: 0, ...i })));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((cur) =>
      qty <= 0
        ? cur.filter((i) => keyOf(i) !== key)
        : cur.map((i) => (keyOf(i) === key ? { ...i, qty: Math.min(qty, MAX_QTY) } : i))
    );
  }, []);

  const add = useCallback((id: string, size: number, variant = 0) => {
    setItems((cur) => {
      const key = keyOf({ id, variant, size });
      const hit = cur.find((i) => keyOf(i) === key);
      return hit
        ? cur.map((i) => (i === hit ? { ...i, qty: Math.min(i.qty + 1, MAX_QTY) } : i))
        : [...cur, { id, variant, size, qty: 1 }];
    });
  }, []);

  const value = useMemo<Cart>(() => {
    const lines = items.map((i) => {
      const product = productById(i.id)!;
      const unit = priceOf(product);
      const { variant: index, ...rest } = i;
      const variant = product.variants[index] ?? product.variants[0];
      return { ...rest, key: keyOf(i), product, variant, unit, lineTotal: unit * i.qty };
    });
    return {
      ready,
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.lineTotal, 0),
      open,
      setOpen,
      add,
      setQty,
      remove: (key) => setQty(key, 0),
      clear: () => setItems([]),
    };
  }, [items, ready, open, add, setQty]);

  // Announce bag changes (not the initial load) as one complete phrase, without moving focus.
  const [announcement, setAnnouncement] = useState("");
  const lastCount = useRef<number | null>(null);
  useEffect(() => {
    if (!ready) return;
    if (lastCount.current !== null && lastCount.current !== value.count) {
      setAnnouncement(value.count === 0 ? "Your bag is now empty." : `Bag updated: ${value.count} ${value.count === 1 ? "item" : "items"}.`);
    }
    lastCount.current = value.count;
  }, [ready, value.count]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </CartContext.Provider>
  );
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside <CartProvider>");
  return cart;
}
