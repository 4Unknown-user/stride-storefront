"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";
import SearchDialog from "./SearchDialog";
import SiteMenu from "./SiteMenu";

const LINKS = [
  { label: "Collaborations", href: "/collections/collaborations" },
  { label: "Concepts", href: "/collections/concepts" },
  { label: "Luxury", href: "/collections/luxury" },
  { label: "Lookbook", href: "/lookbook" },
];

// Colours come from <html data-nav> (set by NavTheme): light by default, white over the dark hero
// while at the top, and dark glass everywhere on a dark page.
const TOP = "text-neutral-900 in-data-[nav=hero]:text-white in-data-[nav=dark]:text-white";
// The logo is black artwork, so it inverts to white exactly where the text above turns white.
const LOGO_TOP = "in-data-[nav=hero]:invert in-data-[nav=dark]:invert";
const LOGO_SCROLLED = "in-data-[nav=dark]:invert";
const SCROLLED =
  "bg-white/70 text-neutral-900 backdrop-blur-md in-data-[nav=dark]:bg-black/60 in-data-[nav=dark]:text-white";

// 44px hit area around a 20px icon.
const ICON_BTN = "flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-current/10";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { count, setOpen } = useCart();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled ? SCROLLED : TOP}`}>
      <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-6 md:px-12 md:py-4">
        <div className="flex items-center gap-1">
          <button onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-haspopup="dialog" className={`${ICON_BTN} md:hidden`}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M4 8h16M4 16h16" strokeLinecap="round" />
            </svg>
          </button>
          <Link href="/" aria-label="Stride home" className="shrink-0 md:-ml-2.5">
            <Image
              src="/logo.png"
              alt="Stride"
              width={866}
              height={288}
              priority
              className={`h-8 w-auto transition-[filter] duration-500 ${scrolled ? LOGO_SCROLLED : LOGO_TOP}`}
            />
          </Link>
        </div>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-1 text-xs font-medium uppercase tracking-[0.15em]">
            {LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  aria-current={pathname.startsWith(href) ? "page" : undefined}
                  className="block whitespace-nowrap rounded-full px-4 py-2.5 opacity-75 transition hover:bg-current/10 hover:opacity-100 aria-[current=page]:bg-current/10 aria-[current=page]:opacity-100"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center">
          <button onClick={() => setSearchOpen(true)} aria-label="Search" aria-haspopup="dialog" className={ICON_BTN}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </button>
          <button
            onClick={() => setOpen(true)}
            aria-label={`Open bag, ${count} ${count === 1 ? "item" : "items"}`}
            aria-haspopup="dialog"
            className="relative flex h-11 items-center gap-1.5 rounded-full px-3 text-xs font-medium uppercase tracking-[0.15em] transition hover:bg-current/10"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M5 8h14l-1 12H6L5 8Z" strokeLinejoin="round" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
            </svg>
            <span className="hidden sm:inline">Bag</span>
            {/* Keyed on count so the number re-plays its rise animation whenever something is added. */}
            <span key={count} className="inline-block animate-rise tabular-nums">({count})</span>
          </button>
        </div>
      </div>

      {/* Portalled to <body>; rendered after mount only, since portals can't be server-rendered. */}
      {mounted && (
        <>
          <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
          <SiteMenu open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
        </>
      )}
    </header>
  );
}
