"use client";
import { useMemo, useState } from "react";
import { m } from "framer-motion";
import type { Project } from "@/lib/types";
import { ProjectCard } from "./blocks";
import { cn } from "@/lib/utils";

const FILTERS: { key: string; label: string; test: (p: Project) => boolean }[] = [
  { key: "all", label: "All Projects", test: () => true },
  { key: "black-friday", label: "Black Friday", test: (p) => p.campaign_type === "black-friday" },
  { key: "christmas", label: "Christmas", test: (p) => p.campaign_type === "christmas" },
  { key: "new-year", label: "New Year", test: (p) => p.campaign_type === "new-year" },
  { key: "banner-design", label: "Banner Design", test: (p) => p.service_category === "banner-design" || p.related_services.includes("banner-design") },
  { key: "flyer-design", label: "Flyer Design", test: (p) => p.service_category === "flyer-design" || p.related_services.includes("flyer-design") },
  { key: "email-copywriting", label: "Email Copywriting", test: (p) => p.service_category === "email-copywriting" || p.related_services.includes("email-copywriting") },
  { key: "social-media-design", label: "Social Media Design", test: (p) => p.service_category === "social-media-design" || p.related_services.includes("social-media-design") },
  { key: "fashion", label: "Fashion", test: (p) => p.industry === "fashion" },
  { key: "beauty", label: "Beauty", test: (p) => p.industry === "beauty" },
  { key: "electronics", label: "Electronics", test: (p) => p.industry === "electronics" },
  { key: "lifestyle", label: "Lifestyle", test: (p) => p.industry === "lifestyle" },
];

export function WorkGallery({ projects }: { projects: Project[] }) {
  const [f, setF] = useState("all");
  const shown = useMemo(() => projects.filter(FILTERS.find((x) => x.key === f)!.test), [projects, f]);
  return (
    <div>
      <div role="group" aria-label="Filter projects" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {FILTERS.map((x) => {
          const n = projects.filter(x.test).length;
          if (!n && x.key !== "all") return null; // hide filters with nothing in them
          return <button key={x.key} onClick={() => setF(x.key)} aria-pressed={f === x.key} className={cn("flex-none rounded-full border px-4 py-2 text-sm font-medium transition", f === x.key ? "border-lime bg-lime text-black" : "border-white/20 text-white/80 hover:border-lime hover:text-lime")}>{x.label}</button>;
        })}
      </div>
      <p className="mt-4 text-sm text-mute" aria-live="polite">{shown.length} project{shown.length === 1 ? "" : "s"}</p>
      <m.div key={f} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-6 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
        {shown.map((p, i) => <ProjectCard key={p.id} p={p} tall={i % 4 === 0} />)}
      </m.div>
    </div>
  );
}
