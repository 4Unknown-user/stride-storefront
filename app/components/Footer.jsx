import Link from "next/link";
import Image from "next/image";
import { categories } from "../../lib/data";

const COLUMNS = [
  { title: "Shop", links: categories.map((c) => ({ label: c.name, href: `/collections/${c.slug}` })).concat({ label: "All styles", href: "/collections" }) },
  { title: "Company", links: [{ label: "Lookbook", href: "/lookbook" }, { label: "Our Story", href: "/our-story" }, { label: "Sustainability", href: "/our-story" }] },
  { title: "Help", links: [{ label: "Shipping", href: "/help#shipping" }, { label: "Returns", href: "/help#returns" }, { label: "Size Guide", href: "/help#sizing" }, { label: "Contact", href: "/help#contact" }] },
];

export default function Footer() {
  return (
    <footer className="bg-neutral-950 px-6 pt-24 pb-10 text-white md:px-12">
      <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" aria-label="Stride home" className="-ml-2.5 inline-block">
            <Image src="/logo.png" alt="Stride" width={866} height={288} className="h-8 w-auto invert" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            Everyday sneakers, made carefully since 1974. Built to be worn, repaired and worn again.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">{col.title}</p>
            <ul className="mt-5 space-y-3 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/70 transition hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Oversized wordmark: the page's last word, set big enough to bleed off both edges. */}
      <p aria-hidden="true" className="mt-24 select-none text-center font-serif text-[26vw] leading-[0.8] tracking-tighter text-white/[0.06]">
        Stride
      </p>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/60 md:flex-row md:items-center">
        <p>© {new Date().getFullYear()} Stride. All rights reserved.</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li><Link href="/legal/privacy" className="transition hover:text-white">Privacy Policy</Link></li>
          <li><Link href="/legal/terms" className="transition hover:text-white">Terms of Service</Link></li>
          <li><Link href="/help#returns" className="transition hover:text-white">Returns</Link></li>
        </ul>
      </div>
    </footer>
  );
}
