import Link from "next/link";
import { categories, catalogData, productsIn } from "../../lib/data";

const TABS = [{ slug: null, name: "All", count: catalogData.length }].concat(
  categories.map((c) => ({ slug: c.slug, name: c.name, count: productsIn(c.name).length }))
);

// active: the current category slug, or null for "All".
export default function CategoryTabs({ active = null, dark = false }) {
  return (
    <nav aria-label="Categories" className="flex flex-wrap gap-2">
      {TABS.map((t) => {
        const on = t.slug === active;
        return (
          <Link
            key={t.name}
            href={t.slug ? `/collections/${t.slug}` : "/collections"}
            aria-current={on ? "page" : undefined}
            className={`rounded-full border px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] transition ${
              on
                ? dark ? "border-white bg-white text-black" : "border-black bg-black text-white"
                : dark ? "border-white/20 hover:border-white" : "border-neutral-300 hover:border-black"
            }`}
          >
            {t.name} <span className="ml-1 opacity-50">{t.count}</span>
          </Link>
        );
      })}
    </nav>
  );
}
