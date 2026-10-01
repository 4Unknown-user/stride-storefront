// The site's public origin, used for canonical URLs, the sitemap, robots.txt and social share images.
// Set NEXT_PUBLIC_SITE_URL to the real domain. Accepts "https://www.example.com" or a bare "example.com";
// on Vercel it falls back to the project's production domain, and to localhost in development.
function siteUrl() {
  const candidates = [process.env.NEXT_PUBLIC_SITE_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL, "localhost:3000"];
  for (const raw of candidates) {
    const value = raw?.trim().replace(/\/+$/, "");
    if (!value) continue;
    const withScheme = /^https?:\/\//i.test(value) ? value : `${value.startsWith("localhost") ? "http" : "https"}://${value}`;
    try {
      return new URL(withScheme).origin;
    } catch {
      // not a usable URL: try the next candidate rather than failing the build
    }
  }
  return "http://localhost:3000";
}

export const SITE = {
  name: "Stride",
  url: siteUrl(),
  description:
    "Stride makes sneakers at the edge of fashion and technology: cinematic collaborations, lab concepts and hand-finished luxury low-tops.",
  // ponytail: placeholder inbox; swap for the real support address before launch.
  supportEmail: "care@example.com",
};
