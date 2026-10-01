"use client";

import { useEffect } from "react";
import Link from "next/link";

// Shown when a page throws while rendering. `reset` re-renders the failed segment.
export default function Error({ error, reset }) {
  useEffect(() => {
    // ponytail: console only. Forward to an error tracker (Sentry etc.) once one is set up.
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[85svh] max-w-2xl flex-col items-center justify-center px-6 pb-24 pt-36 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.4em] text-neutral-600">Something went wrong</p>
      <h1 className="mt-5 font-serif text-6xl leading-[0.95] tracking-tighter md:text-7xl">We tripped.</h1>
      <p className="mt-6 text-neutral-600">An unexpected error stopped this page from loading. Your bag is safe. Try again, or head back home.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <button onClick={reset} className="rounded-full bg-black px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-neutral-800">
          Try again
        </button>
        <Link href="/" className="rounded-full border border-neutral-900 px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] transition hover:bg-neutral-900 hover:text-white">
          Back to home
        </Link>
      </div>
    </main>
  );
}
