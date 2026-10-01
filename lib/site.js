// Site-wide constants. Set NEXT_PUBLIC_SITE_URL in the hosting environment to the real domain:
// it drives canonical URLs, the sitemap, robots.txt and social share images.
export const SITE = {
  name: "Stride",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Stride makes sneakers at the edge of fashion and technology: cinematic collaborations, lab concepts and hand-finished luxury low-tops.",
  // ponytail: placeholder inbox; swap for the real support address before launch.
  supportEmail: "care@example.com",
};
