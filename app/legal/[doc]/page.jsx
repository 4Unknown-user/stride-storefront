import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE } from "../../../lib/site";

// IMPORTANT: template policies. They describe how this codebase actually behaves (local-storage bag, no
// accounts, no analytics) but have NOT been reviewed by a lawyer. Get them reviewed, and update them
// whenever payments, analytics, accounts or marketing email are added, before the site takes real orders.
const UPDATED = "30 September 2026";

const DOCS = {
  privacy: {
    title: "Privacy Policy",
    intro: "This policy explains what information Stride collects when you use this website, why we collect it, and the choices you have.",
    sections: [
      ["Information we collect", [
        "Order details you enter at checkout: your name, email address, phone number (optional), delivery address and the items you buy.",
        "Your shopping bag, which is stored in your own browser's local storage so it is still there when you come back. It is not sent to us until you place an order.",
        "Basic technical information that every web server receives, such as your IP address and browser type, used to keep the site secure and running.",
      ]],
      ["How we use it", [
        "To process, deliver and support your order, including sending order confirmations and delivery updates.",
        "To answer questions you send to our client care team.",
        "To detect and prevent fraud and abuse, and to meet our legal and tax obligations.",
      ]],
      ["Payments", [
        "Card payments are handled by a PCI-compliant payment processor. Your full card number is never stored on Stride's servers.",
      ]],
      ["Cookies and similar technologies", [
        "We use only what is necessary for the site to work, such as remembering the contents of your bag. We do not use advertising cookies.",
        "If we add analytics or marketing tools in future, we will ask for your consent first and update this policy.",
      ]],
      ["Sharing", [
        "We share order information only with the partners needed to fulfil it: our payment processor and delivery carriers. We do not sell your personal information.",
      ]],
      ["Your rights", [
        "Depending on where you live, you may have the right to access, correct, delete or receive a copy of the personal information we hold about you, and to object to certain uses of it.",
        `To make a request, email ${SITE.supportEmail}. We respond within 30 days.`,
      ]],
      ["Retention", [
        "We keep order records for as long as required by tax and consumer law, and delete or anonymise them after that.",
      ]],
      ["Changes to this policy", [
        "When we change this policy we update the date at the top of this page. Significant changes will be highlighted on the site.",
      ]],
    ],
  },
  terms: {
    title: "Terms of Service",
    intro: "These terms apply when you browse this website or buy from Stride. By placing an order you agree to them.",
    sections: [
      ["Orders", [
        "An order is an offer to buy. It is accepted when we send a confirmation that your order has shipped.",
        "We may decline or cancel an order, for example if an item is unavailable, a price was listed in error, or we suspect fraud. If we cancel, you are refunded in full.",
      ]],
      ["Prices and payment", [
        "Prices are shown in US dollars. Taxes and delivery charges are calculated and shown at checkout before you pay.",
        "Payment is taken when you place your order.",
      ]],
      ["Delivery", [
        "Delivery times are estimates. Risk in the goods passes to you on delivery.",
      ]],
      ["Returns and refunds", [
        "You may return unworn items in their original packaging within 30 days of delivery for a full refund. Details are on our Help page.",
        "This does not affect any rights you have under consumer law where you live.",
      ]],
      ["Product information", [
        "We try to show colours and materials accurately, but screens vary and handmade products differ slightly from pair to pair.",
      ]],
      ["Intellectual property", [
        "All content on this site, including images, text, designs and the Stride name and logo, belongs to Stride or its licensors and may not be reused without permission.",
      ]],
      ["Limitation of liability", [
        "To the extent permitted by law, Stride is not liable for indirect or consequential losses arising from use of this site or our products. Nothing in these terms limits liability that cannot be limited by law.",
      ]],
      ["Governing law", [
        "These terms are governed by the laws of the jurisdiction in which Stride is established, without affecting mandatory consumer protections in your country of residence.",
      ]],
      ["Contact", [
        `Questions about these terms: ${SITE.supportEmail}.`,
      ]],
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((doc) => ({ doc }));
}

export async function generateMetadata({ params }) {
  const doc = DOCS[(await params).doc];
  return { title: doc ? doc.title : "Not found" };
}

export default async function LegalPage({ params }) {
  const { doc: slug } = await params;
  const doc = DOCS[slug];
  if (!doc) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 pb-32 pt-36">
      <p className="text-xs font-medium uppercase tracking-[0.4em] text-neutral-600">Legal · Last updated {UPDATED}</p>
      <h1 className="mt-5 font-serif text-5xl leading-[0.95] tracking-tighter md:text-7xl">{doc.title}</h1>
      <p className="mt-8 text-lg leading-relaxed text-neutral-600">{doc.intro}</p>

      <nav aria-label="Legal documents" className="mt-10 flex gap-2">
        {Object.entries(DOCS).map(([key, d]) => (
          <Link
            key={key}
            href={`/legal/${key}`}
            aria-current={key === slug ? "page" : undefined}
            className="rounded-full border border-neutral-300 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] transition hover:border-black aria-[current=page]:border-black aria-[current=page]:bg-black aria-[current=page]:text-white"
          >
            {d.title}
          </Link>
        ))}
      </nav>

      <div className="mt-14 space-y-12">
        {doc.sections.map(([heading, paragraphs], i) => (
          <section key={heading}>
            <h2 className="flex items-baseline gap-4 text-xl font-semibold tracking-tight">
              <span className="font-serif text-sm text-neutral-600">{String(i + 1).padStart(2, "0")}</span>
              {heading}
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed text-neutral-700">
              {paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
