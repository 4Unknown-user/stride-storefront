import { SITE } from "../lib/site";
import { catalogData, categories } from "../lib/data";

export default function sitemap() {
  const page = (path, priority) => ({ url: `${SITE.url}${path}`, changeFrequency: "weekly", priority });
  return [
    page("", 1),
    page("/collections", 0.9),
    ...categories.map((c) => page(`/collections/${c.slug}`, 0.8)),
    ...catalogData.map((p) => page(`/product/${p.id}`, 0.7)),
    page("/lookbook", 0.6),
    page("/our-story", 0.5),
    page("/help", 0.4),
    page("/legal/privacy", 0.2),
    page("/legal/terms", 0.2),
  ];
}
