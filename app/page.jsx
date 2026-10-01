import Link from "next/link";
import HeroCarousel from "./components/HeroCarousel";
import HorizontalBelt from "./components/HorizontalBelt";
import CatalogGrid from "./components/CatalogGrid";
import { Promises, CollectionTiles, LookbookTeaser } from "./components/HomeSections";
import { catalogData, featured } from "../lib/data";

export default function Page() {
  return (
    <main>
      <HeroCarousel />
      <Promises />
      <HorizontalBelt />
      <CollectionTiles />
      <CatalogGrid
        products={featured}
        eyebrow="Featured"
        heading="Shoes speak louder than words"
        footer={
          <Link
            href="/collections"
            className="rounded-full border border-neutral-900 px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] transition hover:bg-neutral-900 hover:text-white"
          >
            View all {catalogData.length} styles
          </Link>
        }
      />
      <LookbookTeaser />
    </main>
  );
}
