// Pure pricing + validation helpers shared by the cart drawer and checkout. Checked by lib/checkout.check.mjs.

export const TAX_RATE = 0.08;
export const FREE_SHIPPING_FROM = 300;
export const SHIPPING = {
  standard: { label: "Standard", eta: "3–5 business days", price: (subtotal) => (subtotal >= FREE_SHIPPING_FROM ? 0 : 15) },
  express: { label: "Express", eta: "1–2 business days", price: () => 35 },
};

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
export const money = (n) => usd.format(n);

// Round to cents at each step so the displayed lines always add up to the displayed total.
const cents = (n) => Math.round(n * 100) / 100;

export function totals(subtotal, method = "standard") {
  const shipping = subtotal > 0 ? SHIPPING[method].price(subtotal) : 0;
  const tax = cents(subtotal * TAX_RATE);
  return { subtotal: cents(subtotal), shipping, tax, total: cents(subtotal + shipping + tax) };
}

// Luhn checksum: catches typos in a card number without knowing anything about the card.
export function luhn(digits) {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) d = d * 2 > 9 ? d * 2 - 9 : d * 2;
    sum += d;
  }
  return digits.length > 0 && sum % 10 === 0;
}

// "MM/YY", not before the current month.
export function expiryValid(value, now = new Date()) {
  const m = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Returns { field: message } for every invalid field; empty object means the form can be submitted.
export function validateCheckout(f, now = new Date()) {
  const e = {};
  const need = (k, label) => !String(f[k] ?? "").trim() && (e[k] = `${label} is required`);

  if (!EMAIL.test(f.email ?? "")) e.email = "Enter a valid email address";
  need("firstName", "First name");
  need("lastName", "Last name");
  need("address", "Address");
  need("city", "City");
  need("region", "State / region");
  if (!/^[A-Za-z0-9 -]{3,10}$/.test((f.postal ?? "").trim())) e.postal = "Enter a valid postal code";
  need("country", "Country");

  const card = (f.cardNumber ?? "").replace(/\s/g, "");
  if (!/^\d{13,19}$/.test(card) || !luhn(card)) e.cardNumber = "Enter a valid card number";
  need("cardName", "Name on card");
  if (!expiryValid(f.expiry ?? "", now)) e.expiry = "Use MM/YY, not in the past";
  if (!/^\d{3,4}$/.test(f.cvc ?? "")) e.cvc = "3 or 4 digits";
  return e;
}
