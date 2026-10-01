import Link from "next/link";
import Image from "next/image";
import Parallax from "../components/Parallax";

export const metadata = { title: "Our Story", description: "Heritage, craftsmanship and the materials behind every pair of Stride sneakers." };

const PRINCIPLES = [
  { n: "01", title: "Considered materials", body: "Organic cotton canvas, responsibly tanned leather and natural rubber. Nothing we cannot trace back to its source." },
  { n: "02", title: "Built to be rebuilt", body: "Every cupsole is stitched, not just glued, so a worn pair can be resoled rather than replaced." },
  { n: "03", title: "Nothing left behind", body: "Offcuts become insoles, boxes are fully recycled, and every returned pair is repaired, resold or responsibly recycled." },
];

// A shoe PNG blown up far past its size and blurred into pure colour and light.
function Glow({ src, className = "" }) {
  return <Image src={src} alt="" aria-hidden="true" width={558} height={447} quality={40} className={`pointer-events-none w-full select-none blur-3xl ${className}`} />;
}

export default function OurStoryPage() {
  return (
    <main className="overflow-hidden">
      {/* Opening */}
      <section className="relative flex min-h-svh items-center px-6 pt-24 md:px-12">
        <Parallax speed={20} className="absolute -right-[20vw] top-[10vh] w-[90vw] opacity-40">
          <Glow src="/collab-prism.png" />
        </Parallax>
        <div className="relative max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-neutral-600">Our Story</p>
          <h1 className="mt-8 font-serif text-6xl leading-[0.95] tracking-tight md:text-8xl lg:text-[9rem]">
            Made to be
            <br />
            <em className="font-normal">walked in.</em>
          </h1>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-neutral-600 md:text-xl">
            For five decades, Stride has made one thing, and made it carefully: the everyday sneaker. Not the loudest
            shoe in the room, but the one you reach for without thinking.
          </p>
        </div>
      </section>

      {/* Heritage */}
      <section className="grid items-center gap-16 px-6 py-32 md:grid-cols-2 md:px-12 md:py-48">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-[#efe6da] to-[#b98a5e]">
          <Parallax speed={12} className="absolute inset-0 flex items-center justify-center">
            <Image src="/style-woven.png" alt="Woven Low in cognac woven leather" width={558} height={447} sizes="(min-width: 768px) 40vw, 80vw" className="w-[85%] -rotate-12 object-contain drop-shadow-2xl" />
          </Parallax>
        </div>
        <div className="max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-neutral-600">Chapter I — Heritage</p>
          <h2 className="mt-6 font-serif text-5xl leading-tight md:text-6xl">A workshop, a last, and a stubborn idea.</h2>
          <div className="mt-8 space-y-5 leading-relaxed text-neutral-600">
            <p>
              Stride began in 1974 in a single-room workshop, with one wooden last and a conviction that a good shoe
              should outlast the trend it was born into. The first pairs were cut, stitched and finished by hand, and
              sold to people who came back years later asking for exactly the same thing.
            </p>
            <p>
              Half a century on, the silhouette has barely changed. We have simply spent those years refining what
              you cannot see: the pitch of the heel, the density of the foam, the way canvas softens after the
              hundredth wear.
            </p>
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section className="relative px-6 py-32 md:px-12 md:py-48">
        <Parallax speed={-25} className="absolute left-1/2 top-1/2 w-[120vw] -translate-x-1/2 -translate-y-1/2 opacity-25">
          <Glow src="/collab-iron.png" />
        </Parallax>
        <blockquote className="relative mx-auto max-w-5xl text-center font-serif text-4xl leading-tight md:text-7xl">
          “We don’t design for a season. We design for the thousandth mile.”
        </blockquote>
      </section>

      {/* Craftsmanship */}
      <section className="px-6 py-32 md:px-12 md:py-48">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-neutral-600">Chapter II — A Legacy of Craftsmanship</p>
          <h2 className="mt-6 max-w-4xl font-serif text-5xl leading-tight md:text-7xl">Every pair passes through more than a hundred hands-on steps.</h2>
          <div className="mt-20 grid gap-12 md:grid-cols-3">
            {[
              ["120+", "individual steps from cutting table to final lace"],
              ["48 h", "resting time on the last, so the shape holds for years"],
              ["1", "artisan signs off each pair before it leaves the bench"],
            ].map(([stat, label]) => (
              <div key={stat} className="border-t border-neutral-900 pt-6">
                <p className="font-serif text-6xl md:text-7xl">{stat}</p>
                <p className="mt-3 max-w-[16rem] text-neutral-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability — dark chapter */}
      <section className="relative overflow-hidden bg-[#0f1411] px-6 py-32 text-white md:px-12 md:py-48">
        <Parallax speed={18} className="absolute -left-[25vw] bottom-0 w-[100vw] opacity-30">
          <Glow src="/concept-organic.png" />
        </Parallax>
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">Chapter III — Sustainability</p>
          <h2 className="mt-6 max-w-4xl font-serif text-5xl leading-tight md:text-7xl">
            The most sustainable shoe is the one you never have to replace.
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
            We choose eco-conscious materials not as a marketing line but as a design constraint. It shapes what we
            make, how we make it, and what happens to it when you are done.
          </p>
          <div className="mt-20 grid gap-12 md:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p.n}>
                <p className="font-serif text-2xl text-white/60">{p.n}</p>
                <h3 className="mt-4 text-xl font-semibold">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-white/60">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="relative flex min-h-[80svh] flex-col items-center justify-center px-6 text-center">
        <Parallax speed={10} className="w-[min(80vw,560px)]">
          <Image src="/joker-tailored.png" alt="Tailored in violet pleated leather and emerald suede" width={558} height={447} sizes="(min-width: 640px) 560px, 80vw" className="w-full -rotate-6 object-contain drop-shadow-2xl" />
        </Parallax>
        <h2 className="mt-12 font-serif text-5xl md:text-7xl">Find your pair.</h2>
        <Link
          href="/collections"
          className="mt-10 rounded-full bg-black px-10 py-4 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-neutral-800"
        >
          Explore the collection
        </Link>
      </section>
    </main>
  );
}
