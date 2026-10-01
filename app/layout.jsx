import { Playfair_Display, Montserrat } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cursor from "./components/Cursor";
import { CartProvider } from "./components/CartProvider";
import CartDrawer from "./components/CartDrawer";
import { SITE } from "../lib/site";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Stride — Sneakers at the edge of fashion and technology", template: "%s — Stride" },
  description: SITE.description,
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "Stride — Sneakers at the edge of fashion and technology",
    description: SITE.description,
    images: [{ url: "/lookbook-milano.png", width: 1672, height: 941, alt: "White leather Stride sneakers in a penthouse at sunset" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="bg-canvas font-sans antialiased text-neutral-900">
        {/* First tab stop on every page: lets keyboard users jump past the navigation. */}
        <a
          href="#content"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition-transform focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
          <CartDrawer />
        </CartProvider>
        <Cursor />
      </body>
    </html>
  );
}
