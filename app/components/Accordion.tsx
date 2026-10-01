"use client";

import { useId, useState, type ReactNode } from "react";

// Height animates via the grid-rows 0fr → 1fr trick, so no content measuring is needed.
export default function Accordion({ items }: { items: { title: string; body: ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const uid = useId();

  return (
    <div className="divide-y divide-neutral-200 border-y border-neutral-200">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.title}>
            <h3>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`${uid}-${i}`}
                className="flex w-full items-center justify-between py-5 text-left font-medium"
              >
                {item.title}
                <span className={`text-xl transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} aria-hidden="true">
                  +
                </span>
              </button>
            </h3>
            <div
              id={`${uid}-${i}`}
              role="region"
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <div className="pb-6 text-sm leading-relaxed text-neutral-600">{item.body}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
