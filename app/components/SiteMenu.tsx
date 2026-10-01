"use client";

import { useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useModal } from "./useModal";
import { categories } from "../../lib/data";

const GROUPS = [
  {
    title: "Shop",
    links: [...categories.map((c) => ({ label: c.name, href: `/collections/${c.slug}` })), { label: "All styles", href: "/collections" }],
  },
  {
    title: "Stride",
    links: [
      { label: "Lookbook", href: "/lookbook" },
      { label: "Our Story", href: "/our-story" },
      { label: "Help & FAQ", href: "/help" },
    ],
  },
];

// Full-screen navigation for small screens, where the header only has room for the logo and icons.
export default function SiteMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const root = useRef<HTMLDivElement>(null);
  useModal(open, onClose, root);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div ref={root} className={`fixed inset-0 z-[90] md:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={`absolute inset-0 flex flex-col overflow-y-auto bg-ink px-6 pb-10 pt-5 text-white transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-[0.4em] text-white/60">Menu</span>
          <button onClick={onClose} aria-label="Close menu" className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-3xl leading-none transition hover:bg-white/10">
            ×
          </button>
        </div>

        <nav aria-label="Main" className="mt-10 space-y-10">
          {GROUPS.map((g) => (
            <div key={g.title}>
              <p className="text-xs font-medium uppercase tracking-[0.4em] text-white/60">{g.title}</p>
              <ul className="mt-4">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={onClose}
                      aria-current={pathname === l.href ? "page" : undefined}
                      className="flex items-center justify-between border-b border-white/10 py-4 font-serif text-3xl tracking-tight transition hover:pl-2 aria-[current=page]:italic"
                    >
                      {l.label}
                      <span aria-hidden="true" className="text-lg text-white/45">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </div>,
    document.body
  );
}
