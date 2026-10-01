import Image from "next/image";

// A small product cutout (bag lines, search results, pickers). `px` is the largest size it is ever shown at;
// Next serves a resized AVIF/WebP instead of the full 300KB PNG. Decorative by default: the name sits beside it.
export default function Thumb({ src, px, alt = "", className = "" }: { src: string; px: number; alt?: string; className?: string }) {
  return <Image src={src} alt={alt} width={px} height={Math.round((px * 447) / 558)} className={`object-contain ${className}`} />;
}
