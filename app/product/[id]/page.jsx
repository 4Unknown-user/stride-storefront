import { notFound } from "next/navigation";
import { catalogData, productById, priceOf } from "../../../lib/data";
import { SITE } from "../../../lib/site";
import ProductDetail from "../../components/ProductDetail";

// Every product page is built at build time.
export function generateStaticParams() {
  return catalogData.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const product = productById((await params).id);
  if (!product) return { title: "Not found" };
  return {
    title: `${product.title} · ${product.variants[0].color}`,
    description: product.description,
    alternates: { canonical: `/product/${product.id}` },
    openGraph: { title: `${product.title} — Stride`, description: product.description, images: [product.variants[0].src] },
  };
}

export default async function ProductPage({ params }) {
  const product = productById((await params).id);
  if (!product) notFound();

  // Structured data so search engines can show price and availability in results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    category: product.category,
    brand: { "@type": "Brand", name: SITE.name },
    image: product.variants.map((v) => `${SITE.url}${v.src}`),
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/product/${product.id}`,
      priceCurrency: "USD",
      price: priceOf(product),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      {/* Content is our own static catalogue data; "<" is escaped so it can never close the script tag. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ProductDetail product={product} />
    </>
  );
}
