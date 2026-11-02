"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/campaigns", label: "Campaigns", sub: [{ href: "/campaigns/black-friday", label: "Black Friday" }, { href: "/campaigns/christmas", label: "Christmas" }, { href: "/campaigns/new-year", label: "New Year" }] },
  { href: "/work", label: "Our Work" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About Us" },
];

export function Nav() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  const active = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={cn("hidden border-b border-white/10 bg-black/60 text-center text-xs text-mute backdrop-blur transition-all lg:block", scrolled ? "h-0 overflow-hidden border-0 opacity-0" : "py-1.5")}>
        Need a Website? <Link href="/website-development" className="text-white/80 underline decoration-white/30 underline-offset-2 hover:text-lime">Request Website Development.</Link>
      </div>
      <nav aria-label="Main" className={cn("transition-all duration-300", scrolled || open ? "border-b border-white/10 bg-ink/90 backdrop-blur-xl" : "bg-gradient-to-b from-black/70 to-transparent")}>
        <div className="container-x flex h-[68px] items-center justify-between">
          <Logo />
          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.href} className="group relative">
                <Link href={l.href} aria-current={active(l.href) ? "page" : undefined} className={cn("relative block rounded-full px-4 py-2 text-sm font-medium transition hover:text-lime", active(l.href) ? "text-lime" : "text-white/80")}>
                  {l.label}
                  {active(l.href) && <i className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded bg-lime" />}
                </Link>
                {l.sub && (
                  <div className="invisible absolute left-0 top-full w-52 translate-y-1 rounded-xl border border-white/10 bg-card p-2 opacity-0 shadow-2xl transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {l.sub.map((s) => <Link key={s.href} href={s.href} className="block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-lime">{s.label}</Link>)}
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <Link href="/start-project" onClick={() => track("cta_click", { location: "nav" })} className="btn btn-lime hidden !min-h-[42px] !px-5 !py-2 !text-xs sm:inline-flex">Start a project</Link>
            <button aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="drawer" onClick={() => setOpen(!open)} className="grid h-11 w-11 place-items-center rounded-full border border-white/20 lg:hidden">
              <span className="relative block h-3 w-5"><i className={cn("absolute left-0 h-0.5 w-5 bg-white transition", open ? "top-1.5 rotate-45" : "top-0")} /><i className={cn("absolute left-0 top-1.5 h-0.5 w-5 bg-white transition", open && "opacity-0")} /><i className={cn("absolute left-0 h-0.5 w-5 bg-white transition", open ? "top-1.5 -rotate-45" : "top-3")} /></span>
            </button>
          </div>
        </div>
      </nav>
      <div id="drawer" className={cn("fixed inset-x-0 bottom-0 top-[68px] overflow-y-auto bg-ink px-5 pb-10 pt-6 transition duration-300 lg:hidden", open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0")}>
        <ul className="space-y-1">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={cn("flex items-center justify-between border-b border-white/10 py-4 font-display text-3xl uppercase", active(l.href) ? "text-lime" : "text-white")}>{l.label}{active(l.href) && <i className="h-2 w-2 rounded-full bg-lime" />}</Link>
              {l.sub && <div className="flex flex-wrap gap-2 py-3">{l.sub.map((s) => <Link key={s.href} href={s.href} className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-white/70">{s.label}</Link>)}</div>}
            </li>
          ))}
        </ul>
        <Link href="/start-project" className="btn btn-lime mt-8 w-full">Start a project</Link>
        <p className="mt-6 text-center text-sm text-mute">Need a Website? <Link href="/website-development" className="underline">Request Website Development.</Link></p>
      </div>
    </header>
  );
}
