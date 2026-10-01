import { notFound } from "next/navigation";
import CatalogGrid from "../../components/CatalogGrid";
import CategoryTabs from "../../components/CategoryTabs";
import NavTheme from "../../components/NavTheme";
import { categories, categoryBySlug, productsIn } from "../../../lib/data";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }) {
  const cat = categoryBySlug((await params).category);
  return cat ? { title: cat.name, description: cat.blurb } : { title: "Not found" };
}

export default async function CategoryPage({ params }) {
  const cat = categoryBySlug((await params).category);
  if (!cat) notFound();
  const products = productsIn(cat.name);

  return (
    <main className={`pt-16 ${cat.dark ? "bg-ink" : ""}`}>
      {cat.dark && <NavTheme mode="dark" />}
      <CatalogGrid
        products={products}
        dark={cat.dark}
        eyebrow={`${products.length} styles`}
        heading={cat.name}
        intro={cat.blurb}
        nav={<CategoryTabs active={cat.slug} dark={cat.dark} />}
        level={1}
        sortable
      />
    </main>
  );
}
