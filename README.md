# Stride storefront

The Stride sneaker storefront: Next.js 16 (App Router), React 19, Tailwind CSS v4 and GSAP.
Every page is statically generated at build time.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run check    # pricing + card-validation self-checks
```

Requires Node 20 or newer.

## Deploy

1. Push the repository to GitHub and import it into Vercel (or any host that runs `next build` / `next start`).
2. Set `NEXT_PUBLIC_SITE_URL` to the live domain (see `.env.example`). It drives canonical URLs, `sitemap.xml`, `robots.txt` and share images.
3. Work through **Before taking real orders** below.

## Where things live

| Path | What it is |
| --- | --- |
| `lib/data.js` | The catalogue: hero shoes, products, colourways, categories. Add a product here and its page, grid card, search entry and sitemap row appear automatically. |
| `lib/checkout.js` | Pricing (tax, shipping) and checkout validation. Pure functions, covered by `npm run check`. |
| `lib/site.js` | Site name, URL, description, support email. |
| `app/globals.css` | Design tokens (`canvas`, `ink`, `field`, `accent`), fonts, focus style, keyframes. |
| `app/components/` | Shared UI. `useModal.ts` is the one place overlay behaviour (focus trap, Escape, scroll lock) is defined. |
| `app/template.jsx` | The page-to-page transition. |
| `public/` | Product cutouts (558×447 transparent PNG), hero plates, lookbook photography, logo, favicon. |

## Before taking real orders

The shop front is complete; these parts are intentionally not wired to anything real yet.

- **Payments.** `app/checkout/page.jsx` validates the form and then simulates success. No card data leaves the browser. Replace the simulated step with a payment provider's hosted checkout (e.g. Stripe Checkout) and remove the "Demo · no charge" badge.
- **Orders and stock.** There is no backend: orders are not saved, no confirmation email is sent, and nothing tracks inventory.
- **Legal pages.** `app/legal/[doc]/page.jsx` contains template Privacy and Terms text. It has not had legal review and must be updated when payments, analytics or accounts are added.
- **Support email.** `lib/site.js` uses a placeholder address.
- **Brand and asset rights.** Several collaboration products reference third-party film and comic characters. Clear the rights, or replace those images and names, before launch.
- **Brand copy.** Heritage details on the Our Story page (founding year, figures) and the Lookbook captions are placeholder copy.
