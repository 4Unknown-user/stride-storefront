// Shared product data for every page.

// Hero themes. plate is the atmospheric background photograph for each shoe.
export const shoeData = [
  {
    id: "void", src: "/collab-prism.png", plate: "/hero-void.png", title: "Prism Void", subtitle: "Iridescent Obsidian", word: "VOID",
    price: "$320", href: "/product/collab-prism", swatch: "bg-[#6d28d9]",
    desc: "Faceted like cut glass, it shifts from obsidian to oil-slick violet with every step.",
  },
  {
    id: "grid", src: "/collab-tron.png", plate: "/hero-grid.png", title: "Grid Legacy", subtitle: "Neon Laser", word: "GRID",
    price: "$270", href: "/product/collab-tron", swatch: "bg-[#06b6d4]",
    desc: "Black mesh traced in laser-cut light, riding on a sole that glows from within.",
  },
  {
    id: "neural", src: "/concept-algo.png", plate: "/hero-neural.png", title: "Neural Lattice", subtitle: "Cyan/Magenta Grid", word: "NEURAL",
    price: "$250", href: "/product/concept-algo", swatch: "bg-[#d946ef]",
    desc: "A generative lattice midsole, grown by algorithm and printed in a single piece.",
  },
  {
    id: "ascend", src: "/collab-iron.png", plate: "/hero-ascend.png", title: "Stark Ascend", subtitle: "Repulsor Red & Gold", word: "ASCEND",
    price: "$280", href: "/product/collab-iron", swatch: "bg-[#b91c1c]",
    desc: "Candy-red armour plating, gold trim and a glowing core set into the ankle.",
  },
  {
    id: "laugh", src: "/joker-velvet.png", plate: "/hero-laugh.png", title: "The Last Laugh", subtitle: "Plum Velvet & Emerald", word: "LAUGH",
    price: "$360", href: "/collections/luxury", swatch: "bg-[#6b2170]",
    desc: "Crushed plum velvet with a patent emerald heel and a red leather lining.",
  },
];

export const categories = [
  {
    slug: "collaborations", name: "Collaborations", dark: true,
    blurb: "Limited partnerships with the worlds of film, games and fiction. Built loud, made to be collected.",
  },
  {
    slug: "concepts", name: "Concepts", dark: false,
    blurb: "Experiments in form and material from our design lab. Some will become classics; all of them ask questions.",
  },
  {
    slug: "luxury", name: "Luxury", dark: false,
    blurb: "Quiet, exceptional materials on the everyday low-top. Velvet, suede, woven leather, finished by hand.",
  },
];

// One variant per product for now; the card and PDP only show swatches when there are several.
const p = (id, category, title, price, color, swatch, description) => ({
  id, category, title, price, description, variants: [{ color, src: `/${id}.png`, swatch }],
});

export const catalogData = [
  p("collab-iron", "Collaborations", "Stark Ascend", "$280", "Repulsor Red & Gold", "bg-[#b91c1c]",
    "Candy-red armour panels, gold trim and a glowing core set into the collar. A statement mid-top engineered like a suit."),
  p("collab-panther", "Collaborations", "Kinetic Panther", "$260", "Obsidian & Violet Pulse", "bg-[#7c3aed]",
    "Matte black mesh traced in violet light, with silver claw eyelets running up the lacing."),
  p("collab-symbiote", "Collaborations", "Symbiote", "$250", "Gloss Black & Bone", "bg-[#111111]",
    "A gloss black upper overtaken by a bone-white organic web that wraps down into a clawed outsole."),
  p("collab-bat", "Collaborations", "Night Vigil", "$290", "Tactical Blackout", "bg-[#1f1f1f]",
    "A strapped, armoured mid-boot in total black. Aggressive lugs, a buckled collar, nothing reflective."),
  p("collab-joker", "Collaborations", "Wild Card", "$210", "Acid Green & Purple Splatter", "bg-[#65a30d]",
    "Distressed canvas high-top splattered in acid green and purple, finished with studs, chains and yellow laces."),
  p("collab-tron", "Collaborations", "Grid Legacy", "$270", "Neon Laser", "bg-[#06b6d4]",
    "Black mesh traced in laser-cut cyan light, riding on a translucent sole that glows from within."),
  p("collab-terminal", "Collaborations", "Terminal Override", "$260", "Black & Phosphor Green", "bg-[#22c55e]",
    "Black tech panels, phosphor-green code printed on the quarter and a sole lit like a live terminal."),
  p("collab-prism", "Collaborations", "Prism Void", "$320", "Iridescent Obsidian", "bg-[#6d28d9]",
    "Faceted like cut glass, the upper shifts from obsidian to oil-slick violet and blue with every step."),

  p("concept-origami", "Concepts", "Fold", "$230", "Bone Paper", "bg-[#d6cfc0]",
    "Paper-like panels folded and hand-stitched over a sculpted sole. Deliberately raw, deliberately unfinished."),
  p("concept-algo", "Concepts", "Neural Lattice", "$250", "Cyan/Magenta Grid", "bg-[#d946ef]",
    "A grey knit upper on a generative lattice midsole, grown by algorithm and printed in a single piece."),
  p("concept-organic", "Concepts", "Organic Form", "$240", "Bone & Blaze Orange", "bg-[#ea580c]",
    "A bone-white exoskeleton grown around a blaze-orange knit sock. Structure only where the foot needs it."),
  p("concept-aero", "Concepts", "Aero Module", "$310", "Moon White & Gold Foil", "bg-[#d4a017]",
    "A zip-front mid-boot in moon-white ripstop and crinkled gold foil, with a lugged expedition sole."),
  p("concept-regime", "Concepts", "Regime", "$180", "Slate Suede", "bg-[#6b7280]",
    "Slate-grey suede low-top with perforated toe and a stitched graphic trailing along the heel."),

  p("style-charcoal", "Luxury", "Charcoal Low", "$220", "Charcoal Linen & Black Leather", "bg-[#3f3f46]",
    "Charcoal linen-weave upper with black leather trims and a tonal cupsole. Understated to the last stitch."),
  p("style-suede", "Luxury", "Olive Suede Low", "$240", "Olive Suede", "bg-[#4d5d2a]",
    "Deep olive suede on a cream sole, lined in tan leather. The everyday sneaker, made exceptional."),
  p("style-woven", "Luxury", "Woven Low", "$340", "Cognac Woven Leather", "bg-[#9a4a1c]",
    "Hand-woven cognac leather strips over a clean white sole. Every pair takes a full day to weave."),
  {
    id: "style-minimal", category: "Luxury", title: "Milano Clean", price: "$260",
    description: "Nappa leather on a stitched cupsole, cut from a single pattern in our Milan atelier. Nothing added, nothing missing.",
    variants: [
      { color: "White Leather & Gum", src: "/style-minimal-gum.png", swatch: "bg-[#f4f1ea]" },
      { color: "Midnight Navy Leather", src: "/style-minimal-navy.png", swatch: "bg-[#1f2a44]" },
      { color: "Black Leather & Gum", src: "/style-minimal-black.png", swatch: "bg-[#111111]" },
    ],
  },
  p("concept-terrace", "Luxury", "Terrazza", "$320", "Cognac Leather & Espresso Suede", "bg-[#a0632e]",
    "Burnished cognac calfskin with an espresso suede toe cap, lined in glove-soft leather and finished by hand in the Marche region of Italy."),
  p("style-velvet", "Luxury", "Midnight Velvet", "$380", "Navy Velvet & Satin Lace", "bg-[#1e2a5a]",
    "Crushed navy velvet with black satin ribbon laces and a polished black sole. Evening, reconsidered."),
  p("joker-block", "Luxury", "Colour Block", "$290", "White, Emerald & Violet", "bg-[#16a34a]",
    "White calf leather with an emerald perforated toe and a violet heel. A quiet shoe that isn't."),
  p("joker-tailored", "Luxury", "Tailored", "$360", "Violet Pleated Leather & Emerald Suede", "bg-[#6b21a8]",
    "Pleated violet leather framed in emerald suede, like a well-cut suit rendered as a sneaker."),
];

export const categoryBySlug = (slug) => categories.find((c) => c.slug === slug);
export const productsIn = (name) => catalogData.filter((x) => x.category === name);
export const slugOf = (categoryName) => categoryName.toLowerCase();
export const productById = (id) => catalogData.find((x) => x.id === id);
export const priceOf = (product) => Number(product.price.replace(/[^0-9.]/g, ""));

// The home grid: two from each category.
export const featured = ["collab-panther", "collab-terminal", "concept-origami", "concept-organic", "style-woven", "joker-block"]
  .map((id) => catalogData.find((x) => x.id === id));
