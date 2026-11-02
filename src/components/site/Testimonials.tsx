"use client";
import { useRef } from "react";
import Image from "next/image";
import type { Testimonial } from "@/lib/types";

export function TestimonialSlider({ items }: { items: Testimonial[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const go = (d: number) => ref.current?.scrollBy({ left: d * (ref.current.clientWidth * 0.8), behavior: "smooth" });
  return (
    <div>
      <div ref={ref} className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 sm:mx-0 sm:px-0" tabIndex={0} role="region" aria-label="Client testimonials">
        {items.map((t) => (
          <figure key={t.id} className="card w-[88%] flex-none snap-start p-7 sm:w-[560px] sm:p-9">
            <blockquote className="font-display text-2xl uppercase leading-snug sm:text-3xl">“{t.quote}”</blockquote>
            <figcaption className="mt-7 flex items-center gap-3">
              {t.photo_url ? <Image src={t.photo_url} alt="" width={48} height={48} className="h-12 w-12 rounded-full object-cover" /> : <span className="grid h-12 w-12 place-items-center rounded-full bg-lime font-display text-lg text-black">{t.name[0]}</span>}
              <span className="text-sm"><b className="block">{t.name}</b><span className="text-mute">{[t.role, t.company].filter(Boolean).join(", ")}</span></span>
            </figcaption>
          </figure>
        ))}
      </div>
      {items.length > 1 && <div className="mt-6 flex gap-2"><button onClick={() => go(-1)} aria-label="Previous testimonial" className="btn btn-ghost !min-h-[44px] !w-11 !p-0">←</button><button onClick={() => go(1)} aria-label="Next testimonial" className="btn btn-ghost !min-h-[44px] !w-11 !p-0">→</button></div>}
    </div>
  );
}
