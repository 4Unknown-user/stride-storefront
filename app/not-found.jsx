import Link from "next/link";
import { featured } from "../lib/data";
import Thumb from "./components/Thumb";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[85svh] max-w-5xl flex-col items-center justify-center px-6 pb-24 pt-36 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.4em] text-neutral-600">Error 404</p>
      <h1 className="mt-5 font-serif text-6xl leading-[0.95] tracking-tighter md:text-8xl">This path ends here.</h1>
      <p className="mt-6 max-w-md text-neutral-600">
        The page you were looking for has moved, sold out, or never existed. These are still very much in stock.
      </p>

      <ul className="mt-12 grid w-full grid-cols-3 gap-4">
        {featured.slice(0, 3).map((p) => (
          <li key={p.id}>
            <Link href={`/product/${p.id}`} className="group block rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-xl">
              <Thumb src={p.variants[0].src} px={320} className="aspect-square w-full transition-transform duration-500 group-hover:-translate-y-1" />
              <p className="mt-3 text-sm font-semibold tracking-tight">{p.title}</p>
              <p className="text-sm font-light text-neutral-600">{p.price}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <Link href="/collections" className="rounded-full bg-black px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-neutral-800">
          Shop the collection
        </Link>
        <Link href="/" className="rounded-full border border-neutral-900 px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] transition hover:bg-neutral-900 hover:text-white">
          Back to home
        </Link>
      </div>
    </main>
  );
}
