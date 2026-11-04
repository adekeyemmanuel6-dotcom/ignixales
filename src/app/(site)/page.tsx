import Link from "next/link";
import type { Metadata } from "next";
import { getAllServiceImages, getCampaigns, getFaqs, getPackages, getProjects, getServices, getStats, getTestimonials } from "@/lib/content";
import { industries } from "@/lib/defaults";
import { Btn, Arrow, ALink } from "@/components/ui/Button";
import { Section, Heading, Lime } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CampaignArt } from "@/components/ui/CampaignArt";
import { Visual } from "@/components/ui/Visual";
import { ServiceGallery } from "@/components/site/ServiceGallery";
import { Icon } from "@/components/ui/Icon";
import { Comparison, CtaBand, DashboardIllustration, FaqList, HScroll, JsonLd, PackageCard, ProcessSteps, ProjectCard, StatsGrid, faqJsonLd } from "@/components/site/blocks";
import { TestimonialSlider } from "@/components/site/Testimonials";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "E-commerce Graphic Design Agency for Campaigns | Ignixales",
  description: "Ignixales is an e-commerce graphic design agency for seasonal campaigns: banner design, promotional flyers, social media design and email copywriting for Black Friday, Christmas and New Year.",
  alternates: { canonical: "/" },
};

const features = [
  ["cart", "E-commerce focused", "We understand the visual and promotional needs of online retailers."],
  ["layers", "Campaign consistency", "Your banners, flyers, social graphics and email messaging work together."],
  ["calendar", "Seasonal expertise", "Creative support for Black Friday, Christmas and New Year sales."],
  ["brand", "Brand-first design", "Every creative asset should feel like an extension of your brand."],
  ["target", "Conversion-focused thinking", "Clear offers, strong visual hierarchy and compelling calls to action."],
  ["route", "Simple project process", "Submit your brief, upload your assets, approve the direction and receive your creatives."],
] as const;

export default async function Home() {
  const [packages, services, campaigns, stats, faqs, testimonials, { projects, fromDb }] = await Promise.all([getPackages(), getServices(), getCampaigns(), getStats(), getFaqs(), getTestimonials(), getProjects()]);
  const { by: gal, pool } = await getAllServiceImages();
  const pick = (i: number) => (pool.length ? pool[i % pool.length].url : undefined);
  const featured = projects.filter((p) => p.featured);
  const statCards = (featured.length >= 3 ? featured : projects).slice(0, 3);
  const grid = projects.slice(0, 8);
  const heroTiles = [
    { k: "black-friday", cls: "col-span-4 row-span-3" },
    { k: "christmas", cls: "col-span-2 row-span-4" },
    { k: "fashion", cls: "col-span-2 row-span-3" },
    { k: "skincare", cls: "col-span-2 row-span-3" },
    { k: "homepage", cls: "col-span-2 row-span-2" },
  ] as const;

  return (
    <>
      {/* 1 HERO */}
      <section className="relative overflow-hidden bg-ink pb-12 pt-28 sm:pt-36 lg:pb-16">
        <div className="grain pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-lime/10 blur-[140px]" />
        <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="label mb-5 flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-lime" />E-commerce campaign creative studio</p>
            <h1 className="h-display text-[clamp(2.8rem,7.2vw,5.8rem)]">Your ultimate<br />e-commerce<br /><Lime>creative partner.</Lime></h1>
            <p className="mt-5 max-w-xl text-lg text-mute">We create powerful promotional designs and compelling campaign copy that help e-commerce brands stand out, attract attention, and make every sales season count.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Btn href="/pricing" event="cta_click" eventParams={{ location: "hero_packages" }}>Explore our packages <Arrow /></Btn>
              <Btn href="/work" variant="ghost">View our work</Btn>
            </div>
            <p className="mt-6 text-sm text-mute">Built for ambitious e-commerce brands.</p>
          </div>
          <div className="mx-auto grid aspect-square w-full max-w-[560px] grid-cols-6 grid-rows-6 gap-2.5 sm:gap-3 lg:max-w-[540px] lg:justify-self-end">
            {heroTiles.map((t, i) => (
              <div key={t.k} className={cn("group relative overflow-hidden rounded-2xl border border-white/10 bg-card shadow-xl shadow-black/40", t.cls)}>
                <div className="h-full w-full transition duration-700 group-hover:scale-[1.04]"><Visual img={pick(i)} kind={t.k} alt="Campaign design sample" /></div>
              </div>
            ))}
          </div>
        </div>
        {pool.length === 0 && <p className="container-x relative mt-6 text-[11px] text-white/35 lg:text-right">Campaign artwork shown is original concept work by Ignixales.</p>}
      </section>

      {/* 2 TRUST STRIP */}
      <section className="border-y border-white/10 bg-surface py-10">
        <div className="container-x text-center">
          <p className="mx-auto max-w-3xl font-display text-xl uppercase leading-snug sm:text-2xl">Creative campaigns for brands ready to make their next sales season count.</p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium uppercase tracking-[0.2em] text-mute">
            {industries.map((c, i) => <li key={c} className="flex items-center gap-4">{c}{i < industries.length - 1 && <i className="h-1 w-1 rounded-full bg-lime" />}</li>)}
          </ul>
        </div>
      </section>

      {/* 3 VALUE PROP */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Heading title={<>Your brand deserves more than <Lime>ordinary</Lime> promotional designs.</>} />
          <Reveal delay={100}>
            <p className="text-lg text-white/85">We help online stores transform seasonal promotions into cohesive visual campaigns.</p>
            <p className="mt-4 text-mute">From homepage banners and promotional flyers to social media creatives and persuasive email copy, we help your brand show up consistently wherever your customers interact with you.</p>
            <div className="mt-7"><ALink href="/services">Discover what we do</ALink></div>
          </Reveal>
        </div>
        <Reveal delay={150} className="card mt-14 grid grid-cols-3 gap-3 p-3 sm:grid-cols-6 sm:gap-4 sm:p-5">
          {(["homepage", "flyer", "social", "email", "fashion", "electronics"] as const).map((k, i) => <div key={k} className={cn("overflow-hidden rounded-xl", i % 2 ? "aspect-[3/4]" : "aspect-square")}><Visual img={pick(i + 6)} kind={k} /></div>)}
        </Reveal>
      </Section>

      {/* 4 WHY */}
      <Section tone="surface">
        <Heading center label="Why Ignixales?" title={<>Great campaigns. Smart creative. <Lime>Better brand experiences.</Lime></>} />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([icon, t, d], i) => (
            <Reveal key={t} delay={(i % 3) * 80} className="group card p-7 transition hover:-translate-y-1 hover:border-lime/40">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-lime/10 text-lime transition group-hover:bg-lime group-hover:text-black"><Icon name={icon} /></span>
              <h3 className="mt-6 font-display text-2xl uppercase">{t}</h3><p className="mt-2 text-sm text-mute">{d}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 5 STATS (light) */}
      <Section light>
        <Heading light label="Studio results" title="Creative that helps brands show up with confidence." />
        <StatsGrid stats={stats} />
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {statCards.map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              <Link href={`/work/${p.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-card">
                <div className="h-full transition duration-700 group-hover:scale-105"><Visual img={p.cover_url ?? pick(i + 3)} kind={p.art ?? "homepage"} concept={p.is_concept && !pool.length} /></div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5 pt-16 text-white"><p className="font-display text-2xl uppercase">{p.title}</p></div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 6 SERVICES */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Heading label="What we do" title={<>Everything your e-commerce campaign needs. <Lime>All in one place.</Lime></>} />
          <Btn href="/services" variant="ghost">All services</Btn>
        </div>
        <HScroll className="mt-12">
          {services.map((s) => (
            <article key={s.slug} className="card w-[84%] flex-none snap-start overflow-hidden sm:w-[420px]">
              <div className="aspect-[4/3] overflow-hidden"><Visual img={gal[s.slug]?.[0]?.url} kind={s.art} alt={s.title} /></div>
              <div className="p-6">
                <p className="label">Service {s.index}</p>
                <h3 className="mt-2 font-display text-3xl uppercase">{s.title}</h3>
                <p className="mt-2 text-sm text-mute">{s.short}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">{s.deliverables.slice(0, 4).map((d) => <li key={d} className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-white/70">{d}</li>)}</ul>
                {s.note && <p className="mt-3 text-xs text-lime/80">{s.note}</p>}
                <div className="mt-5"><ALink href={`/services/${s.slug}`}>View service</ALink></div>
              </div>
            </article>
          ))}
        </HScroll>
      </Section>

      {/* 7 SEASONAL */}
      <Section tone="surface">
        <Heading center label="Seasonal campaigns" title={<>Make every sales <Lime>season count.</Lime></>} />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {campaigns.map((c, i) => (
            <Reveal key={c.slug} delay={i * 100}>
              <Link href={`/campaigns/${c.slug}`} className="group card flex h-full flex-col overflow-hidden transition hover:border-lime/50">
                <div className="aspect-[4/3] overflow-hidden"><div className="h-full transition duration-700 group-hover:scale-105"><CampaignArt kind={c.art} /></div></div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-4xl uppercase">{c.name}</h3>
                  <p className="mt-2 text-sm text-white/75">{c.blurb}</p>
                  <p className="mt-2 text-xs text-white/45">{c.styleNote}</p>
                  <span className="link-arrow mt-auto pt-5">{c.cta} <Arrow /></span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 8 PROCESS */}
      <Section>
        <Heading center label="How it works" title={<>From brief to beautiful campaign. <Lime>Simple.</Lime></>} />
        <div className="mt-14 grid items-start gap-6 lg:grid-cols-[1.2fr_1fr]">
          <ProcessSteps />
          <Reveal delay={150}><DashboardIllustration /></Reveal>
        </div>
        <div className="mt-10 text-center"><Btn href="/start-project" event="cta_click" eventParams={{ location: "process" }}>Start your campaign <Arrow /></Btn></div>
      </Section>

      {/* 9 PRICING */}
      <Section light id="packages">
        <Heading light label="Packages" title="The right creative package for every campaign." sub="Four clear packages. Compare what is included and choose the one that fits your campaign." />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{packages.map((p) => <PackageCard key={p.slug} p={p} light />)}</div>
        <p className="mt-8 text-center text-sm text-black/60">Need something different? <Link href="/start-project?package=custom" className="font-semibold text-dark underline">Request a custom campaign package.</Link> · <Link href="/pricing" className="font-semibold text-dark underline">See full comparison</Link></p>
      </Section>

      {/* 10 COMPARISON */}
      <Section>
        <Heading center label="Why choose us?" title={<>Why e-commerce brands choose <Lime>Ignixales.</Lime></>} />
        <div className="mt-12"><Comparison /></div>
      </Section>

      {/* 11 FEATURED PROJECTS */}
      <Section tone="surface">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Heading label="Featured projects" title={<>A look at what <Lime>we create.</Lime></>} />
          <Btn href="/work" variant="ghost">View all work</Btn>
        </div>
        {!fromDb && pool.length > 0 ? <div className="mt-12"><ServiceGallery images={pool.slice(0, 12)} /></div> : (
        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {grid.map((p, i) => <Reveal key={p.id} delay={(i % 3) * 70}><ProjectCard p={p} tall={i % 3 === 0} /></Reveal>)}
        </div>
        )}
        {!pool.length && projects[0]?.is_concept && <p className="mt-2 text-xs text-mute">Projects shown are concept designs created by Ignixales, labelled as such. Completed client work will appear here once published.</p>}
      </Section>

      {/* 12 TESTIMONIALS (only genuine, published ones) */}
      {testimonials.length > 0 && (
        <Section>
          <Heading label="Testimonials" title={<>What brands say about <Lime>working with us.</Lime></>} />
          <div className="mt-12"><TestimonialSlider items={testimonials} /></div>
        </Section>
      )}

      {/* 13 ABOUT */}
      <Section tone={testimonials.length ? "surface" : "ink"}>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="grid grid-cols-2 gap-3">
            <div className="aspect-[3/4] overflow-hidden rounded-card"><Visual img={pick(1)} kind="black-friday" /></div>
            <div className="mt-10 aspect-[3/4] overflow-hidden rounded-card"><Visual img={pick(4)} kind="new-year" /></div>
          </Reveal>
          <div>
            <Heading label="About Ignixales" title={<>We help e-commerce brands turn creative ideas into <Lime>campaigns.</Lime></>} />
            <Reveal delay={100}>
              <p className="mt-6 text-mute">Ignixales is a creative partner focused on helping online retailers create cohesive, compelling seasonal promotional campaigns.</p>
              <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-2">{["Creative thinking", "E-commerce understanding", "Attention to detail", "Consistent visual communication", "Simple client experience"].map((x) => <li key={x} className="flex items-center gap-2"><i className="h-1.5 w-1.5 rounded-full bg-lime" />{x}</li>)}</ul>
              <div className="mt-8"><Btn href="/about" variant="ghost">Meet Ignixales</Btn></div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* 14 FAQ */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <Heading label="FAQ" title={<>Questions? <Lime>Answered.</Lime></>} sub={<>Can’t find what you need? <Link href="/contact" className="text-lime underline">Contact us</Link>.</>} />
          <Reveal><FaqList items={faqs} /></Reveal>
        </div>
        <JsonLd data={faqJsonLd(faqs)} />
      </Section>

      {/* 15 CTA */}
      <CtaBand />
    </>
  );
}
