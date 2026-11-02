import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function Section({ children, light, className, id, tone = "ink" }: { children: ReactNode; light?: boolean; className?: string; id?: string; tone?: "ink" | "surface" }) {
  return <section id={id} className={cn("py-20 sm:py-28", light ? "section-light" : tone === "surface" ? "bg-surface" : "bg-ink", className)}><div className="container-x">{children}</div></section>;
}
export function Heading({ label, title, sub, center, light, className, as: H = "h2" }: { label?: string; title: ReactNode; sub?: ReactNode; center?: boolean; light?: boolean; className?: string; as?: "h1" | "h2" }) {
  return (
    <Reveal className={cn(center && "mx-auto text-center", "max-w-4xl", className)}>
      {label && <p className={cn("label mb-4 flex items-center gap-2", center && "justify-center", light && "!text-dark")}><i className={cn("block h-2 w-2 rounded-full", light ? "bg-dark" : "bg-lime")} />{label}</p>}
      <H className={cn("h-display text-[clamp(2.3rem,6vw,4.6rem)]", light ? "text-dark" : "text-white")}>{title}</H>
      {sub && <p className={cn("mt-5 max-w-2xl text-lg", center && "mx-auto", light ? "text-black/60" : "text-mute")}>{sub}</p>}
    </Reveal>
  );
}
export const Lime = ({ children }: { children: ReactNode }) => <span className="text-lime">{children}</span>;
export const Check = ({ light }: { light?: boolean }) => (
  <svg className="mt-1 h-4 w-4 flex-none" viewBox="0 0 16 16" fill="none" aria-hidden><circle cx="8" cy="8" r="8" fill={light ? "#111" : "#D8FF00"} /><path d="M4.5 8.2 7 10.5l4.5-5" stroke={light ? "#D8FF00" : "#000"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
