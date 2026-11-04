import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import type { Package, Project, Faq, Stat } from "@/lib/types";
import { cn, labelize, money } from "@/lib/utils";
import { Btn, Arrow, ALink } from "@/components/ui/Button";
import { Check, Heading, Lime } from "@/components/ui/Section";
import { CampaignArt } from "@/components/ui/CampaignArt";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { comparisonRows } from "@/lib/defaults";

/* ---------- Inner page hero ---------- */
export function PageHero({ label, title, sub, children, className }: { label: string; title: ReactNode; sub?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <section className={cn("relative overflow-hidden bg-ink pb-16 pt-36 sm:pb-24 sm:pt-44", className)}>
      <div className="grain pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-lime/10 blur-[120px]" />
      <div className="container-x relative">
        <Heading as="h1" label={label} title={title} sub={sub} className="!max-w-5xl" />
        {children && <Reveal delay={150} className="mt-9 flex flex-wrap gap-3">{children}</Reveal>}
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */
export function CtaBand({ title = <>Your next big sales season starts with the right <Lime>creative.</Lime></>, sub = "Let's create a campaign that makes your brand stand out." }: { title?: ReactNode; sub?: string }) {
  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/10 blur-[110px]" />
      <div className="container-x relative text-center">
        <Reveal><h2 className="h-display mx-auto max-w-5xl text-[clamp(2.4rem,7vw,5.6rem)]">{title}</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-mute">{sub}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Btn href="/start-project" event="cta_click" eventParams={{ location: "final_cta" }}>Start your project <Arrow /></Btn>
            <Btn href="/work" variant="ghost">Explore our work</Btn>
          </div></Reveal>
      </div>
    </section>
  );
}

/* ---------- Package card ---------- */
export function PackageCard({ p, light }: { p: Package; light?: boolean }) {
  const rec = p.recommended;
  return (
    <Reveal className="h-full" lift>
      <article className={cn("relative flex h-full flex-col rounded-card p-6 sm:p-7", light ? (rec ? "bg-dark text-white" : "border border-black/10 bg-white text-dark") : rec ? "border border-lime/60 bg-card shadow-[0_0_60px_-20px_#D8FF00]" : "card")}>
        {rec && <span className="absolute -top-3 left-6 rounded-full bg-lime px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-black">Recommended</span>}
        <h3 className="h-display text-3xl">{p.name}</h3>
        <p className={cn("mt-2 min-h-[48px] text-sm", light && !rec ? "text-black/60" : "text-mute")}>{p.bestFor}</p>
        <p className="mt-5 flex items-baseline gap-2"><span className={cn("h-display text-6xl", rec ? "text-lime" : "")}>{money(p.price, p.currency)}</span><span className={cn("text-xs uppercase tracking-wider", light && !rec ? "text-black/50" : "text-mute")}>starting price</span></p>
        <ul className="mt-6 flex-1 space-y-3 text-sm">{p.deliverables.map((d) => <li key={d} className="flex gap-3"><Check light={light && !rec} />{d}</li>)}</ul>
        <dl className={cn("mt-6 grid grid-cols-2 gap-3 border-t pt-4 text-xs", light && !rec ? "border-black/10" : "border-white/10")}>
          <div><dt className={light && !rec ? "text-black/50" : "text-mute"}>Revisions</dt><dd className="mt-0.5 font-semibold">{p.revisions}</dd></div>
          <div><dt className={light && !rec ? "text-black/50" : "text-mute"}>Typical delivery</dt><dd className="mt-0.5 font-semibold">{p.delivery}</dd></div>
        </dl>
        <Btn href={`/start-project?package=${p.slug}`} variant={rec ? "lime" : light ? "outline-dark" : "ghost"} className="mt-6 w-full" event="package_click" eventParams={{ package: p.slug, price: String(p.price) }}>{rec ? "Choose this package" : "Get started"}</Btn>
      </article>
    </Reveal>
  );
}

/* ---------- Project card ---------- */
export function ProjectCard({ p, className, tall }: { p: Project; className?: string; tall?: boolean }) {
  return (
    <Link href={`/work/${p.slug}`} className={cn("group card block overflow-hidden transition hover:border-lime/50", className)}>
      <div className={cn("relative overflow-hidden", tall ? "aspect-[4/5]" : "aspect-[4/3]")}>
        <div className="h-full w-full transition duration-700 group-hover:scale-[1.04]">
          {p.cover_url ? <Image src={p.cover_url} alt={p.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" /> : <CampaignArt kind={p.art ?? "homepage"} />}
        </div>
        {p.is_concept && <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80 backdrop-blur">Concept</span>}
      </div>
      <div className="p-5">
        <p className="label !text-[10px]">{[labelize(p.industry), labelize(p.campaign_type)].filter(Boolean).join(" · ")}</p>
        <h3 className="mt-2 font-display text-2xl uppercase leading-tight">{p.title}</h3>
        {p.description && <p className="mt-2 line-clamp-2 text-sm text-mute">{p.description}</p>}
        <span className="link-arrow mt-4">View project <Arrow /></span>
      </div>
    </Link>
  );
}

/* ---------- FAQ accordion (native <details>, animated) ---------- */
export function FaqList({ items, light }: { items: Faq[]; light?: boolean }) {
  return (
    <div className={cn("divide-y", light ? "divide-black/10 border-y border-black/10" : "divide-white/10 border-y border-white/10")}>
      {items.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-left font-display text-xl uppercase tracking-wide sm:text-2xl">
            {f.q}<span className={cn("grid h-8 w-8 flex-none place-items-center rounded-full border text-xl leading-none transition group-open:rotate-45", light ? "border-black/20" : "border-white/20 group-open:border-lime group-open:text-lime")}>+</span>
          </summary>
          <div className="acc"><div><p className={cn("max-w-3xl pb-6 text-base", light ? "text-black/65" : "text-mute")}>{f.a}</p></div></div>
        </details>
      ))}
    </div>
  );
}
export function faqJsonLd(items: Faq[]) {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
}
export const JsonLd = ({ data }: { data: object }) => <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;

/* ---------- Stats ---------- */
export function StatsGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
      {stats.map((s, i) => {
        const real = s.value.trim() !== "";
        return (
          <Reveal key={s.id} delay={i * 80} className="border-t border-black/15 pt-5">
            <p className={cn("h-display text-[clamp(3.5rem,8vw,6rem)]", real ? "text-[#2f3dff]" : "text-black/25")}>
              {real ? <CountUp value={s.value} suffix={s.suffix} /> : <>[NUMBER]{s.suffix}</>}
            </p>
            <p className="mt-2 text-base font-medium">{s.label}</p>
            {!real && <p className="mt-1 text-xs text-black/45">Placeholder: add your verified figure in Admin → Content → Stats.</p>}
          </Reveal>
        );
      })}
    </div>
  );
}

/* ---------- Comparison table ---------- */
export function Comparison() {
  const cols = ["Generic freelance designers", "Hiring multiple individual creatives", "Ignixales"];
  const cell = (v: unknown, hl: boolean) => v === true ? <span className={cn("mx-auto grid h-7 w-7 place-items-center rounded-full", hl ? "bg-lime text-black" : "bg-white/10")}><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5 6.5 11.5 12.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span> : <span className="text-xs text-mute">{String(v)}</span>;
  return (
    <div>
      <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left text-sm">
          <caption className="sr-only">Comparison of service models</caption>
          <thead><tr><th className="p-4" />{cols.map((c, i) => <th key={c} scope="col" className={cn("p-4 text-center font-display text-lg uppercase tracking-wide", i === 2 ? "rounded-t-2xl bg-lime text-black" : "text-white/80")}>{c}</th>)}</tr></thead>
          <tbody>
            {comparisonRows.map((r, ri) => (
              <tr key={r.label}>
                <th scope="row" className="border-b border-white/10 p-4 font-medium">{r.label}</th>
                {r.cols.map((v, i) => <td key={i} className={cn("border-b border-white/10 p-4 text-center", i === 2 && "bg-lime/10", i === 2 && ri === comparisonRows.length - 1 && "rounded-b-2xl")}>{cell(v, i === 2)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-mute">This comparison describes service models in general, not any specific freelancer or agency. “Varies” means it depends on the individual.</p>
    </div>
  );
}

/* ---------- Horizontal scroller ---------- */
export function HScroll({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8", className)} tabIndex={0} role="region" aria-label="Scrollable gallery">{children}</div>;
}

/* ---------- Illustrated project dashboard (illustration only; not a live dashboard) ---------- */
export function DashboardIllustration() {
  const rows = [["Project information", "Complete", 100], ["Uploaded files", "12 files", 100], ["Design progress", "In progress", 65], ["Review status", "Awaiting approval", 30], ["Delivery status", "Not yet delivered", 0]] as const;
  return (
    <figure aria-label="Illustration of a project overview" className="card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3"><i className="h-2.5 w-2.5 rounded-full bg-white/20" /><i className="h-2.5 w-2.5 rounded-full bg-white/20" /><i className="h-2.5 w-2.5 rounded-full bg-white/20" /><span className="ml-3 text-xs text-mute">Project overview (illustration)</span></div>
      <div className="space-y-4 p-5 sm:p-6">
        {rows.map(([l, s, p]) => (
          <div key={l}><div className="mb-1.5 flex justify-between text-xs"><span className="font-medium">{l}</span><span className="text-mute">{s}</span></div><div className="h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-lime" style={{ width: `${p}%` }} /></div></div>
        ))}
      </div>
      <figcaption className="border-t border-white/10 px-5 py-3 text-[11px] text-mute">Illustration only. You will receive project updates by email.</figcaption>
    </figure>
  );
}

export function ProcessSteps() {
  const steps = [["Choose your package", "Select the campaign package that matches your business needs."], ["Submit your brief", "Tell us about your brand, campaign, promotional offers and preferred style."], ["Upload your assets", "Upload your logo, product photos, brand guidelines, references and other required files."], ["Review & receive", "We create your campaign assets, share them for review and deliver the approved files."]];
  return (
    <ol className="grid gap-4 sm:grid-cols-2">
      {steps.map(([t, d], i) => (
        <Reveal as="li" key={t} delay={i * 80} className="card p-6 transition hover:border-lime/40" lift>
          <span className="h-display text-5xl text-lime">0{i + 1}</span>
          <h3 className="mt-3 font-display text-2xl uppercase">{t}</h3><p className="mt-2 text-sm text-mute">{d}</p>
        </Reveal>
      ))}
    </ol>
  );
}

export { ALink };
