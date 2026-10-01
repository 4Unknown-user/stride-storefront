import Link from "next/link";
import Image from "next/image";
import { categories, productsIn } from "../../lib/data";
import { FREE_SHIPPING_FROM, money } from "../../lib/checkout";

// One icon language across the site: 24px grid, 1.5px stroke, round caps.
const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const PROMISES = [
  {
    title: "Free delivery",
    body: `On every order over ${money(FREE_SHIPPING_FROM).replace(".00", "")}, tracked door to door.`,
    icon: <><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7.5" cy="17.5" r="1.5" /><circle cx="17.5" cy="17.5" r="1.5" /></>,
  },
  {
    title: "30-day returns",
    body: "Unworn pairs come back free, no questions asked.",
    icon: <><path d="M4 9h11a5 5 0 0 1 0 10H8" /><path d="m8 5-4 4 4 4" /></>,
  },
  {
    title: "Made to be repaired",
    body: "Stitched soles, so a worn pair can be resoled instead of replaced.",
    icon: <><path d="M14.5 5.5a4 4 0 0 0-5.2 5.2L4 16v4h4l5.3-5.3a4 4 0 0 0 5.2-5.2l-2.7 2.7-2.1-.6-.6-2.1z" /></>,
  },
  {
    title: "Finished by hand",
    body: "Every pair is signed off by one artisan before it leaves the bench.",
    icon: <><path d="M12 3l2.5 5.5L20 9.3l-4 4 1 5.7-5-2.8-5 2.8 1-5.7-4-4 5.5-.8z" /></>,
  },
];

export function Promises() {
  return (
    <section aria-label="Why Stride" className="border-y border-neutral-200 bg-white px-6 py-12 md:px-12">
      <ul className="mx-auto grid max-w-7xl gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {PROMISES.map((p) => (
          <li key={p.title} className="flex gap-4">
            <Icon>{p.icon}</Icon>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em]">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{p.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// One signature shoe per collection, on a surface that matches the collection's mood.
const TILE = {
  collaborations: { src: "/collab-prism.png", surface: "bg-ink text-white", muted: "text-white/70", ring: "border-white/30" },
  concepts: { src: "/concept-organic.png", surface: "bg-white", muted: "text-neutral-600", ring: "border-neutral-300" },
  luxury: { src: "/style-woven.png", surface: "bg-stone-200", muted: "text-neutral-700", ring: "border-neutral-400" },
};

export function CollectionTiles() {
  return (
    <section className="px-6 py-28 md:px-12 md:py-36">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-medium uppercase tracking-[0.4em] text-neutral-600">Shop by collection</p>
        <h2 className="mt-5 max-w-4xl font-serif text-5xl leading-[0.95] tracking-tighter md:text-7xl">Three ways in.</h2>

        <ul className="mt-16 grid gap-6 md:grid-cols-3 md:gap-8">
          {categories.map((c) => {
            const t = TILE[c.slug];
            return (
              <li key={c.slug}>
                <Link
                  href={`/collections/${c.slug}`}
                  data-cursor="Shop"
                  className={`group flex h-full flex-col overflow-hidden rounded-2xl p-6 shadow-sm transition-shadow duration-500 hover:shadow-xl md:p-8 ${t.surface}`}
                >
                  <p className={`text-xs font-medium uppercase tracking-[0.3em] ${t.muted}`}>{productsIn(c.name).length} styles</p>
                  <div className="relative my-6 aspect-[558/447]">
                    <Image
                      src={t.src}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 30vw, 90vw"
                      className="object-contain transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:-rotate-6 group-hover:scale-105 motion-reduce:transition-none"
                    />
                  </div>
                  <h3 className="font-serif text-4xl tracking-tight">{c.name}</h3>
                  <p className={`mt-3 flex-1 text-sm leading-relaxed ${t.muted}`}>{c.blurb}</p>
                  <span className={`mt-6 inline-flex items-center gap-2 self-start rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] ${t.ring}`}>
                    Explore
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function LookbookTeaser() {
  return (
    <section className="relative isolate flex min-h-[80svh] items-end overflow-hidden bg-ink text-white">
      <Image src="/lookbook-milano.png" alt="" fill sizes="100vw" quality={85} className="-z-10 object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
      <div className="w-full px-6 pb-16 md:px-12 md:pb-24">
        <p className="text-xs font-medium uppercase tracking-[0.4em] text-white/75">Lookbook · Season 27</p>
        <h2 className="mt-5 font-serif text-7xl leading-[0.9] tracking-tighter md:text-[10vw]">
          After <em className="font-normal">Hours</em>
        </h2>
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-lg leading-relaxed text-white/80">Five cities, one long night. See the collection where it belongs: on the street, after dark.</p>
          <Link
            href="/lookbook"
            className="self-start rounded-full bg-white px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-white/85 active:scale-[0.98] md:self-auto"
          >
            View the lookbook
          </Link>
        </div>
      </div>
    </section>
  );
}
