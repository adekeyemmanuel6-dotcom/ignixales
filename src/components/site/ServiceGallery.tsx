"use client";
import { useCallback, useEffect, useState } from "react";

type Img = { id: string; url: string; title: string | null; brand: string | null };

/** Masonry grid + keyboard-accessible lightbox. */
export function ServiceGallery({ images }: { images: Img[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + images.length) % images.length)), [images.length]);
  useEffect(() => {
    if (open === null) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") close(); if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); };
    window.addEventListener("keydown", k); document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [open, close, step]);
  const cur = open !== null ? images[open] : null;
  return (
    <>
      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
        {images.map((im, i) => (
          <li key={im.id}>
            <button onClick={() => setOpen(i)} className="group relative block w-full overflow-hidden rounded-card border border-white/10 bg-card text-left" aria-label={`View ${im.title || im.brand || "image"} larger`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.url} alt={im.title || im.brand || "Design sample"} loading="lazy" className="h-auto w-full transition duration-500 group-hover:scale-[1.03]" />
              {(im.brand || im.title) && <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/85 to-transparent p-4 pt-10 text-sm font-medium opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">{im.brand || im.title}</span>}
            </button>
          </li>
        ))}
      </ul>
      {cur && (
        <div role="dialog" aria-modal="true" aria-label="Image viewer" className="fixed inset-0 z-[80] grid place-items-center bg-black/90 p-4" onClick={close}>
          <button onClick={close} aria-label="Close" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/30 text-2xl">×</button>
          {images.length > 1 && <><button onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous" className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 text-xl">←</button>
            <button onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next" className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 text-xl">→</button></>}
          <figure onClick={(e) => e.stopPropagation()} className="max-h-full max-w-5xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cur.url} alt={cur.title || cur.brand || "Design sample"} className="mx-auto max-h-[80vh] w-auto rounded-lg" />
            {(cur.brand || cur.title) && <figcaption className="mt-3 text-center text-sm text-white/80">{[cur.brand, cur.title].filter(Boolean).join(" · ")}</figcaption>}
          </figure>
        </div>
      )}
    </>
  );
}
