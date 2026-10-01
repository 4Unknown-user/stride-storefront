// Run: node lib/checkout.check.mjs
import assert from "node:assert/strict";
import { totals, luhn, expiryValid, validateCheckout } from "./checkout.js";

// Pricing: 8% tax on goods only, free standard shipping from $300, express always $35.
assert.deepEqual(totals(250), { subtotal: 250, shipping: 15, tax: 20, total: 285 });
assert.deepEqual(totals(300), { subtotal: 300, shipping: 0, tax: 24, total: 324 });
assert.deepEqual(totals(300, "express"), { subtotal: 300, shipping: 35, tax: 24, total: 359 });
assert.deepEqual(totals(0), { subtotal: 0, shipping: 0, tax: 0, total: 0 });
assert.equal(totals(333.33).tax, 26.67); // rounded to cents

// Card checks.
assert.ok(luhn("4242424242424242"));
assert.ok(!luhn("4242424242424241"));
const now = new Date(2026, 8, 15); // Sept 2026
assert.ok(expiryValid("09/26", now));
assert.ok(!expiryValid("08/26", now));
assert.ok(!expiryValid("13/30", now));

const good = {
  email: "a@b.co", firstName: "A", lastName: "B", address: "1 St", city: "C", region: "R", postal: "10001",
  country: "US", cardNumber: "4242 4242 4242 4242", cardName: "A B", expiry: "12/30", cvc: "123",
};
assert.deepEqual(validateCheckout(good, now), {});
assert.deepEqual(Object.keys(validateCheckout({ ...good, email: "nope", cvc: "1" }, now)).sort(), ["cvc", "email"]);

console.log("checkout checks passed");
