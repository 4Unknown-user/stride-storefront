"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../components/CartProvider";
import { QtyStepper } from "../components/CartDrawer";
import Thumb from "../components/Thumb";
import { money, totals, validateCheckout, SHIPPING, TAX_RATE } from "../../lib/checkout";

const COUNTRIES = [
  ["US", "United States"], ["CA", "Canada"], ["GB", "United Kingdom"], ["DE", "Germany"], ["FR", "France"],
  ["IT", "Italy"], ["JP", "Japan"], ["AU", "Australia"], ["IN", "India"], ["AE", "United Arab Emirates"],
];

const EMPTY_FORM = {
  email: "", phone: "", firstName: "", lastName: "", address: "", apartment: "", city: "", region: "", postal: "",
  country: "US", cardNumber: "", cardName: "", expiry: "", cvc: "",
};

// Input masks: keep only what the field can hold, and add the separators as the user types.
const MASKS = {
  cardNumber: (v) => v.replace(/\D/g, "").slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 "),
  expiry: (v) => v.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2"),
  cvc: (v) => v.replace(/\D/g, "").slice(0, 4),
};

function Section({ n, title, children, aside }) {
  return (
    <fieldset className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
      <legend className="sr-only">{title}</legend>
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="flex items-baseline gap-3 text-lg font-semibold tracking-tight">
          <span className="font-serif text-sm text-neutral-600">{n}</span>
          {title}
        </h2>
        {aside}
      </div>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </fieldset>
  );
}

function Field({ name, label, form, errors, onChange, onBlur, className = "col-span-2", optional, ...input }) {
  const error = errors[name];
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-xs font-medium text-neutral-600">
        {label} {optional && <span className="text-neutral-600">(optional)</span>}
      </label>
      <input
        id={name}
        name={name}
        value={form[name]}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full rounded-xl border bg-field px-4 py-3 text-base outline-none transition placeholder:text-neutral-500 sm:text-sm focus:bg-white focus:ring-4 ${
          error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-neutral-200 focus:border-black focus:ring-black/5"
        }`}
        {...input}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function Summary({ lines, t, method, editable, setQty }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-xs font-medium uppercase tracking-[0.35em] text-neutral-600">Order summary</h2>
      <ul className="mt-6 space-y-5">
        {lines.map((l) => (
          <li key={l.key} className="flex gap-4">
            <div className="relative h-20 w-20 shrink-0 rounded-xl bg-canvas p-2">
              <Thumb src={l.variant.src} px={160} className="h-full w-full" />
              {!editable && (
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs text-white">
                  {l.qty}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex justify-between gap-2 text-sm">
                <span className="font-semibold tracking-tight">{l.product.title}</span>
                <span className="tabular-nums">{money(l.lineTotal)}</span>
              </div>
              <span className="text-xs text-neutral-600">{l.variant.color} · US {l.size}</span>
              {editable && (
                <div className="mt-2">
                  <QtyStepper qty={l.qty} onChange={(q) => setQty(l.key, q)} label={l.product.title} />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-8 space-y-3 border-t border-neutral-100 pt-6 text-sm">
        <div className="flex justify-between">
          <dt className="text-neutral-600">Subtotal</dt>
          <dd className="tabular-nums">{money(t.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-neutral-600">Shipping · {SHIPPING[method].label}</dt>
          <dd className="tabular-nums">{t.shipping === 0 ? "Free" : money(t.shipping)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-neutral-600">Tax ({TAX_RATE * 100}%)</dt>
          <dd className="tabular-nums">{money(t.tax)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-neutral-100 pt-4">
          <dt className="font-semibold">Total</dt>
          <dd className="font-serif text-3xl tracking-tight tabular-nums">{money(t.total)}</dd>
        </div>
      </dl>
    </div>
  );
}

export default function CheckoutPage() {
  const { ready, lines, subtotal, setQty, clear } = useCart();
  const [form, setForm] = useState(EMPTY_FORM);
  const [method, setMethod] = useState("standard");
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | processing
  const [order, setOrder] = useState(null); // snapshot shown on the confirmation screen

  const all = validateCheckout(form);
  // Errors appear per field once it has been left, and everywhere after the first submit attempt.
  const errors = Object.fromEntries(Object.entries(all).filter(([k]) => submitted || touched[k]));
  const t = totals(subtotal, method);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: MASKS[name] ? MASKS[name](value) : value }));
  };
  const onBlur = (e) => setTouched((s) => ({ ...s, [e.target.name]: true }));
  const fieldProps = { form, errors, onChange, onBlur };

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const first = Object.keys(all)[0];
    if (first) return document.getElementById(first)?.focus();

    // Mock payment: nothing leaves the browser. Simulate the processor round-trip, then confirm.
    setStatus("processing");
    setTimeout(() => {
      setOrder({ number: `ST-${Date.now().toString(36).toUpperCase().slice(-6)}`, email: form.email, lines, t, method });
      clear();
      setStatus("idle");
      window.scrollTo({ top: 0 });
    }, 1400);
  };

  if (order) {
    return (
      <main className="mx-auto max-w-3xl px-6 pb-32 pt-36 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m5 12 5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="mt-8 text-xs font-medium uppercase tracking-[0.4em] text-neutral-600">Order {order.number}</p>
        <h1 className="mt-4 font-serif text-5xl tracking-tighter md:text-7xl">Thank you.</h1>
        <p className="mx-auto mt-6 max-w-md text-neutral-600">
          Your order is confirmed. A receipt is on its way to <span className="text-neutral-900">{order.email}</span>.
        </p>
        <div className="mt-12 text-left">
          <Summary lines={order.lines} t={order.t} method={order.method} />
        </div>
        <Link href="/collections" className="mt-12 inline-block rounded-full bg-black px-10 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-neutral-800">
          Continue shopping
        </Link>
      </main>
    );
  }

  if (!ready) {
    return <main className="min-h-screen pt-36" aria-busy="true" />;
  }

  if (lines.length === 0) {
    return (
      <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 pt-24 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.4em] text-neutral-600">Checkout</p>
        <h1 className="mt-4 font-serif text-5xl tracking-tighter md:text-7xl">Your bag is empty.</h1>
        <p className="mt-4 text-neutral-600">Add a pair or two, then come back here to check out.</p>
        <Link href="/collections" className="mt-10 rounded-full bg-black px-10 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-neutral-800">
          Explore the collection
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-32 pt-28 md:px-12">
      <p className="text-xs font-medium uppercase tracking-[0.4em] text-neutral-600">Secure checkout</p>
      <h1 className="mt-4 font-serif text-5xl tracking-tighter md:text-7xl">Checkout</h1>

      <form noValidate onSubmit={onSubmit} className="mt-12 grid items-start gap-8 lg:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <Section n="01" title="Contact">
            <Field name="email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" className="col-span-2 sm:col-span-1" {...fieldProps} />
            <Field name="phone" label="Phone" type="tel" autoComplete="tel" optional placeholder="For delivery updates" className="col-span-2 sm:col-span-1" {...fieldProps} />
          </Section>

          <Section n="02" title="Shipping address">
            <Field name="firstName" label="First name" autoComplete="given-name" className="col-span-1" {...fieldProps} />
            <Field name="lastName" label="Last name" autoComplete="family-name" className="col-span-1" {...fieldProps} />
            <Field name="address" label="Address" autoComplete="address-line1" {...fieldProps} />
            <Field name="apartment" label="Apartment, suite" autoComplete="address-line2" optional {...fieldProps} />
            <Field name="city" label="City" autoComplete="address-level2" className="col-span-2 sm:col-span-1" {...fieldProps} />
            <Field name="region" label="State / region" autoComplete="address-level1" className="col-span-1" {...fieldProps} />
            <Field name="postal" label="Postal code" autoComplete="postal-code" className="col-span-1" {...fieldProps} />
            <div className="col-span-2">
              <label htmlFor="country" className="mb-1.5 block text-xs font-medium text-neutral-600">Country</label>
              <select
                id="country"
                name="country"
                value={form.country}
                onChange={onChange}
                autoComplete="country"
                className="w-full rounded-xl border border-neutral-200 bg-field px-4 py-3 text-base outline-none transition focus:border-black sm:text-sm focus:bg-white focus:ring-4 focus:ring-black/5"
              >
                {COUNTRIES.map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>
          </Section>

          <Section n="03" title="Delivery">
            {Object.entries(SHIPPING).map(([key, m]) => {
              const price = m.price(subtotal);
              return (
                <label
                  key={key}
                  className={`col-span-2 flex cursor-pointer items-center justify-between rounded-xl border px-5 py-4 transition sm:col-span-1 ${
                    method === key ? "border-black bg-field ring-4 ring-black/5" : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input type="radio" name="method" value={key} checked={method === key} onChange={() => setMethod(key)} className="accent-black" />
                    <span>
                      <span className="block text-sm font-medium">{m.label}</span>
                      <span className="block text-xs text-neutral-600">{m.eta}</span>
                    </span>
                  </span>
                  <span className="text-sm tabular-nums">{price === 0 ? "Free" : money(price)}</span>
                </label>
              );
            })}
          </Section>

          <Section
            n="04"
            title="Payment"
            aside={<span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-amber-700">Demo · no charge</span>}
          >
            {/* Mock UI: these values never leave the browser. Browser card autofill is off so nobody's real
                saved card gets poured into a demo form. */}
            <Field name="cardNumber" label="Card number" inputMode="numeric" autoComplete="off" placeholder="4242 4242 4242 4242" {...fieldProps} />
            <Field name="cardName" label="Name on card" autoComplete="off" {...fieldProps} />
            <Field name="expiry" label="Expiry" inputMode="numeric" autoComplete="off" placeholder="MM/YY" className="col-span-1" {...fieldProps} />
            <Field name="cvc" label="CVC" inputMode="numeric" autoComplete="off" placeholder="123" className="col-span-1" {...fieldProps} />
          </Section>

          {submitted && Object.keys(all).length > 0 && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              Please fix the {Object.keys(all).length === 1 ? "highlighted field" : `${Object.keys(all).length} highlighted fields`} above.
            </p>
          )}
        </div>

        <div className="space-y-4 lg:sticky lg:top-24">
          <Summary lines={lines} t={t} method={method} editable setQty={setQty} />
          <button
            type="submit"
            disabled={status === "processing"}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-black py-5 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-neutral-800 disabled:cursor-wait disabled:bg-neutral-700"
          >
            {status === "processing" ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
                Processing…
              </>
            ) : (
              <>Place order · {money(t.total)}</>
            )}
          </button>
          <p className="text-center text-xs text-neutral-600">Free returns within 30 days · Demo store: no payment is taken</p>
        </div>
      </form>
    </main>
  );
}
