import type { Metadata } from "next";
import Link from "next/link";
import { getAllServiceImages, getPackages, getProjects, getServices } from "@/lib/content";
import { meta } from "@/lib/seo";
import { PageHero, CtaBand, ProjectCard } from "@/components/site/blocks";
import { Section, Lime, Check } from "@/components/ui/Section";
import { Btn, ALink, Arrow } from "@/components/ui/Button";
import { Visual } from "@/components/ui/Visual";
import { Reveal } from "@/components/ui/Reveal";
import { cn, money } from "@/lib/utils";

export const metadata: Metadata = meta("E-commerce Creative Services | Banners, Flyers, Social & Email Copy | Ignixales", "Four creative services built around your next big campaign: e-commerce banner design, promotional flyer design, social media design and e-commerce email copywriting.", "/services");

export default async function ServicesPage() {
  const [services, packages, { projects }, { by: gal }] = await Promise.all([getServices(), getPackages(), getProjects(), getAllServiceImages()]);
  return (
    <>
      <PageHero label="Services" title={<>Creative services built around your <Lime>next big campaign.</Lime></>} sub="Four services, one coordinated campaign. Order a full package or just the pieces you need.">
        <Btn href="/pricing">See packages <Arrow /></Btn><Btn href="/start-project?package=individual" variant="ghost">Request individual services</Btn>
      </PageHero>
      {services.map((s, i) => {
        const examples = projects.filter((p) => p.service_category === s.slug).slice(0, 2);
        return (
          <Section key={s.slug} tone={i % 2 ? "surface" : "ink"} id={s.slug}>
            <div className={cn("grid items-center gap-12 lg:grid-cols-2", i % 2 && "lg:[&>*:first-child]:order-2")}>
              <Reveal className="aspect-[4/3] overflow-hidden rounded-card border border-white/10"><Visual img={gal[s.slug]?.[0]?.url} kind={s.art} alt={s.title} /></Reveal>
              <div>
                <p className="label">Service {s.index}</p>
                <h2 className="h-display mt-3 text-[clamp(2.4rem,5vw,4rem)]">{s.title}</h2>
                <p className="mt-5 text-mute">{s.long}</p>
                {s.note && <p className="mt-3 rounded-lg border border-lime/30 bg-lime/5 p-3 text-sm text-lime">{s.note}</p>}
                <div className="mt-7 grid gap-6 sm:grid-cols-2">
                  <div><h3 className="label !text-white/50">Deliverables</h3><ul className="mt-3 space-y-2 text-sm">{s.deliverables.map((d) => <li key={d} className="flex gap-2.5"><Check />{d}</li>)}</ul></div>
                  <div><h3 className="label !text-white/50">Benefits</h3><ul className="mt-3 space-y-2 text-sm">{s.benefits.map((d) => <li key={d} className="flex gap-2.5"><Check />{d}</li>)}</ul>
                    <h3 className="label mt-5 !text-white/50">Industries served</h3><p className="mt-2 text-sm text-mute">{s.industries.join(" · ")}</p></div>
                </div>
                <p className="mt-6 text-xs text-mute">Included in: {packages.map((p) => `${p.name} (${money(p.price, p.currency)})`).join(", ")}</p>
                <div className="mt-7 flex flex-wrap gap-3"><Btn href={`/start-project?package=individual&service=${s.slug}`}>Order this service</Btn><ALink href={`/services/${s.slug}`}>Service details</ALink></div>
              </div>
            </div>
            {examples.length > 0 && <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:w-2/3">{examples.map((p) => <ProjectCard key={p.id} p={p} />)}</div>}
          </Section>
        );
      })}
      <CtaBand />
    </>
  );
}
