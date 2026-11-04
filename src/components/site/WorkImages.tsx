"use client";
import { useState } from "react";
import { ServiceGallery } from "./ServiceGallery";
import { cn } from "@/lib/utils";

const LABEL: Record<string, string> = { "flyer-design": "Flyers", "banner-design": "Banners", "social-media-design": "Social Media", "email-copywriting": "Email Copy" };
type Img = { id: string; url: string; title: string | null; brand: string | null; service: string };

export function WorkImages({ images }: { images: Img[] }) {
  const [f, setF] = useState("all");
  const services = Object.keys(LABEL).filter((s) => images.some((i) => i.service === s));
  const shown = f === "all" ? images : images.filter((i) => i.service === f);
  return (
    <div>
      <div role="group" aria-label="Filter by service" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {["all", ...services].map((s) => <button key={s} onClick={() => setF(s)} aria-pressed={f === s} className={cn("flex-none rounded-full border px-4 py-2 text-sm font-medium transition", f === s ? "border-lime bg-lime text-black" : "border-white/20 text-white/80 hover:border-lime hover:text-lime")}>{s === "all" ? "All work" : LABEL[s]}</button>)}
      </div>
      <div className="mt-8"><ServiceGallery key={f} images={shown} /></div>
    </div>
  );
}
