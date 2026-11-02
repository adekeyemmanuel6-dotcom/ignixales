import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCampaigns, getPackages, getProjects } from "@/lib/content";
import { meta } from "@/lib/seo";
import { PageHero, CtaBand, FaqList, JsonLd, PackageCard, ProjectCard, faqJsonLd } from "@/components/site/blocks";
import { Section, Lime, Heading } from "@/components/ui/Section";
import { Btn, Arrow } from "@/components/ui/Button";
import { CampaignArt } from "@/components/ui/CampaignArt";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type P = { params: Promise<{ slug: string }> };
export async function generateStaticParams() { return ["black-friday", "christmas", "new-year"].map((slug) => ({ slug })); }
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params; const c = (await getCampaigns()).find((x) => x.slug === slug);
  return c ? meta(c.seoTitle, c.seoDescription, `/campaigns/${c.slug}`) : {};
}

/** Each campaign gets its own visual theme while sharing the Ignixales design system. */
const theme = {
  bf: { hero: "bg-ink", accent: "text-lime", card: "card", glow: "bg-lime/10" },
  xmas: { hero: "bg-gradient-to-b from-[#2a0509] to-ink", accent: "text-[#E6C36A]", card: "rounded-card border border-[#E6C36A]/20 bg-[#1d0a0d]", glow: "bg-[#c0212e]/20" },
  ny: { hero: "bg-gradient-to-b from-[#16123d] to-ink", accent: "text-[#9fb0ff]", card: "rounded-card border border-[#7b8cff]/25 bg-[#12142e]", glow: "bg-[#5b5cff]/20" },
} as const;

export default async function CampaignPage({ params }: P) {
  const { slug } = await params;
  const [campaigns, packages, { projects }] = await Promise.all([getCampaigns(), getPackages(), getProjects()]);
  const c = campaigns.find((x) => x.slug === slug);
  if (!c) notFound();
  const t = theme[c.theme];
  const rec = packages.find((p) => p.slug === c.recommendedPackage) ?? packages[0];
  const examples = projects.filter((p) => p.campaign_type === c.slug).slice(0, 3);
  return (
    <>
      <section className={cn("relative overflow-hidden pb-16 pt-36 sm:pt-44", t.hero)}>
        <div className={cn("pointer-events-none absolute -right-32 -top-32 h-[560px] w-[560px] rounded-full blur-[130px]", t.glow)} />
        <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="label mb-5">{c.name} campaigns</p>
            <h1 className="h-display text-[clamp(2.6rem,6vw,5.2rem)]">{c.headline}</h1>
            <p className="mt-6 max-w-xl text-lg text-white/70">{c.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3"><Btn href={`/start-project?package=${rec.slug}&campaign=${c.slug}`} event="cta_click" eventParams={{ location: `campaign_${c.slug}` }}>Start your {c.name.replace(" Sales", "")} campaign <Arrow /></Btn><Btn href="/work" variant="ghost">View our work</Btn></div>
          </div>
          <Reveal className="aspect-[4/3] overflow-hidden rounded-card border border-white/15 shadow-2xl"><CampaignArt kind={c.art} concept /></Reveal>
        </div>
      </section>
      <Section>
        <Heading label="What we create" title={<>Everything for your <span className={t.accent}>{c.name.replace(" Sales", "")}</span> campaign</>} sub={c.styleNote} />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.showcase.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 70} className={cn(t.card, "p-6")}>
              <Icon name={["layers", "target", "cart", "calendar", "brand", "route"][i % 6]} className={cn("h-7 w-7", t.accent)} />
              <h3 className="mt-4 font-display text-2xl uppercase">{s.title}</h3><p className="mt-2 text-sm text-white/60">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </Section>
      <Section tone="surface">
        <Heading label="Examples" title={<>{c.name} <span className={t.accent}>campaign examples</span></>} />
        <div className="mt-10 grid gap-5 md:grid-cols-3">{examples.length ? examples.map((p) => <ProjectCard key={p.id} p={p} />) : <p className="text-mute">Examples will appear here as projects are published.</p>}</div>
      </Section>
      <Section light>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Heading light label="Recommended package" title={`We recommend ${rec.name}.`} sub={rec.bestFor} />
          <div className="max-w-md"><PackageCard p={{ ...rec, recommended: true }} light /></div>
        </div>
        <p className="mt-8 text-sm text-black/60">Prefer a different mix? <a className="font-semibold text-dark underline" href="/pricing">Compare all packages</a> or <a className="font-semibold text-dark underline" href="/start-project?package=custom">request a custom package</a>.</p>
      </Section>
      <Section>
        <Heading label="FAQ" title={<>{c.name} <Lime>questions</Lime></>} />
        <div className="mt-10 max-w-4xl"><FaqList items={c.faqs} /></div>
        <JsonLd data={faqJsonLd(c.faqs)} />
      </Section>
      <CtaBand />
    </>
  );
}
