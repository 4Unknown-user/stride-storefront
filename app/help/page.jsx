import Link from "next/link";
import Accordion from "../components/Accordion";
import { FREE_SHIPPING_FROM, SHIPPING, money } from "../../lib/checkout";
import { SITE } from "../../lib/site";

export const metadata = { title: "Help & FAQ", description: "Shipping, returns, sizing, orders and care: answers from the Stride client care team." };

const SIZES = [
  // US, UK, EU, heel-to-toe cm
  [7, 6, 40, 25.0], [8, 7, 41, 26.0], [9, 8, 42.5, 27.0], [10, 9, 44, 28.0], [11, 10, 45, 29.0], [12, 11, 46, 30.0],
];

const SECTIONS = [
  {
    id: "shipping",
    title: "Shipping",
    items: [
      { title: "How much does shipping cost?", body: `${SHIPPING.standard.label} delivery is free on orders over ${money(FREE_SHIPPING_FROM)} and ${money(15)} otherwise (${SHIPPING.standard.eta}). ${SHIPPING.express.label} delivery is ${money(35)} (${SHIPPING.express.eta}).` },
      { title: "Where do you ship?", body: "We ship to the US, Canada, the UK, the EU, Japan, Australia, India and the UAE. Duties and import taxes for international orders are shown at checkout, never on delivery." },
      { title: "When will my order ship?", body: "Orders placed before 2pm local time on a business day ship the same day. Collaboration drops can take up to 48 hours to leave our studio." },
    ],
  },
  {
    id: "returns",
    title: "Returns & exchanges",
    items: [
      { title: "What is your returns policy?", body: "Return unworn pairs in their original box within 30 days of delivery for a full refund. Returns are free: start one from the link in your order confirmation email." },
      { title: "Can I exchange for a different size?", body: "Yes. Choose 'Exchange' when you start your return and we'll ship the new size as soon as your original pair is scanned by the carrier, so you're never without shoes for long." },
      { title: "Are collaboration pieces returnable?", body: "Collaborations follow the same 30-day policy, but must be returned unworn with all packaging, tags and inserts included." },
    ],
  },
  {
    id: "sizing",
    title: "Sizing",
    items: [
      {
        title: "Size guide",
        body: (
          <table className="mt-2 w-full text-left tabular-nums">
            <thead className="text-xs uppercase tracking-[0.2em] text-neutral-600">
              <tr>
                <th className="py-2 font-medium">US</th>
                <th className="py-2 font-medium">UK</th>
                <th className="py-2 font-medium">EU</th>
                <th className="py-2 font-medium">Foot length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-900">
              {SIZES.map(([us, uk, eu, cm]) => (
                <tr key={us}>
                  <td className="py-2">{us}</td>
                  <td className="py-2">{uk}</td>
                  <td className="py-2">{eu}</td>
                  <td className="py-2">{cm.toFixed(1)} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        ),
      },
      { title: "Do your shoes run true to size?", body: "Our Luxury low-tops run true to size. Collaborations and Concepts with sculpted or armoured uppers run slightly snug; if you're between sizes, size up." },
      { title: "How do I measure my foot?", body: "Stand on a sheet of paper with your heel against a wall, mark the tip of your longest toe, and measure heel to mark in centimetres. Match it to the foot length column above." },
    ],
  },
  {
    id: "orders",
    title: "Orders & payment",
    items: [
      { title: "Which payment methods do you accept?", body: "All major credit and debit cards. Payment is taken when your order is placed." },
      { title: "Can I change or cancel my order?", body: "Orders can be changed or cancelled within one hour of being placed. After that they are already with our studio team; you can return them once they arrive." },
    ],
  },
  {
    id: "care",
    title: "Care",
    items: [
      { title: "How do I care for velvet and suede?", body: "Brush gently with a soft suede brush in one direction. Treat with a protector spray before first wear and keep away from rain. Never machine wash." },
      { title: "How do I care for leather?", body: "Wipe with a damp cloth and condition every few months. Let them dry naturally, away from direct heat." },
      { title: "Can my pair be repaired?", body: "Yes. Most of our pairs are stitched as well as glued, so they can be resoled. Contact us and we'll arrange a repair." },
    ],
  },
];

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-32 pt-36 md:px-12">
      <p className="text-xs font-medium uppercase tracking-[0.4em] text-neutral-600">Help</p>
      <h1 className="mt-4 font-serif text-6xl tracking-tighter md:text-8xl">How can we help?</h1>

      <div className="mt-20 grid gap-16 lg:grid-cols-[220px_1fr]">
        {/* Jump links; sticky on desktop so they're always to hand. */}
        <nav aria-label="Help topics" className="lg:sticky lg:top-28 lg:self-start">
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="block rounded-full border border-neutral-300 px-4 py-2 text-xs uppercase tracking-[0.2em] transition hover:border-black lg:border-0 lg:px-0 lg:text-neutral-600 lg:hover:text-neutral-900">
                  {s.title}
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" className="block rounded-full border border-neutral-300 px-4 py-2 text-xs uppercase tracking-[0.2em] transition hover:border-black lg:border-0 lg:px-0 lg:text-neutral-600 lg:hover:text-neutral-900">
                Contact
              </a>
            </li>
          </ul>
        </nav>

        <div className="space-y-16">
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <h2 className="font-serif text-4xl tracking-tight">{s.title}</h2>
              <div className="mt-6 rounded-2xl bg-white px-6 shadow-sm md:px-8">
                <Accordion items={s.items} />
              </div>
            </section>
          ))}

          <section id="contact" className="scroll-mt-28 rounded-2xl bg-neutral-950 p-8 text-white md:p-12">
            <p className="text-xs font-medium uppercase tracking-[0.4em] text-white/60">Still need us?</p>
            <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">Talk to a person.</h2>
            <p className="mt-4 max-w-md text-white/60">Our client care team replies within one business day, Monday to Saturday.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`mailto:${SITE.supportEmail}`} className="rounded-full bg-white px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-white/85">
                Email client care
              </a>
              <Link href="/collections" className="rounded-full border border-white/30 px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition hover:border-white">
                Back to the collection
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
