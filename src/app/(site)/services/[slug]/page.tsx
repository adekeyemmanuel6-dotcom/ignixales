import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPackages, getProjects, getServiceImages, getServices } from "@/lib/content";
import { ServiceGallery } from "@/components/site/ServiceGallery";
import { meta } from "@/lib/seo";
import { PageHero, CtaBand, FaqList, JsonLd, PackageCard, ProjectCard, faqJsonLd } from "@/components/site/blocks";
import { Section, Lime, Check, Heading } from "@/components/ui/Section";
import { Btn, Arrow } from "@/components/ui/Button";
import { CampaignArt } from "@/components/ui/CampaignArt";
import { Reveal } from "@/components/ui/Reveal";

type P = { params: Promise<{ slug: string }> };
export const revalidate = 60;
export async function generateStaticParams() { return ["banner-design", "flyer-design", "email-copywriting", "social-media-design"].map((slug) => ({ slug })); }
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params; const s = (await getServices()).find((x) => x.slug === slug);
  return s ? meta(s.seoTitle, s.seoDescription, `/services/${s.slug}`) : {};
}

export default async function ServicePage({ params }: P) {
  const { slug } = await params;
  const [services, packages, { projects }] = await Promise.all([getServices(), getPackages(), getProjects()]);
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();
  const gallery = await getServiceImages(slug);
  const examples = projects.filter((p) => p.service_category === s.slug || p.related_services.includes(s.slug)).slice(0, 3);
  return (
    <>
      <PageHero label={`Service ${s.index}`} title={<>{s.title.split(" ").slice(0, -1).join(" ")} <Lime>{s.title.split(" ").slice(-1)}</Lime></>} sub={s.short}>
        <Btn href={`/start-project?package=individual&service=${s.slug}`}>Order this service <Arrow /></Btn><Btn href="/pricing" variant="ghost">View packages</Btn>
      </PageHero>
      <Section tone="surface">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="aspect-[4/3] overflow-hidden rounded-card border border-white/10"><CampaignArt kind={s.art} concept /></Reveal>
          <div>
            <p className="text-lg text-white/85">{s.long}</p>
            {s.note && <p className="mt-4 rounded-lg border border-lime/30 bg-lime/5 p-3 text-sm text-lime">{s.note}</p>}
            <h2 className="label mt-8 !text-white/50">What you get</h2>
            <ul className="mt-3 grid gap-2.5 text-sm sm:grid-cols-2">{s.deliverables.map((d) => <li key={d} className="flex gap-2.5"><Check />{d}</li>)}</ul>
            <h2 className="label mt-8 !text-white/50">Why it works</h2>
            <ul className="mt-3 space-y-2.5 text-sm">{s.benefits.map((d) => <li key={d} className="flex gap-2.5"><Check />{d}</li>)}</ul>
            <p className="mt-6 text-sm text-mute"><b className="text-white">Industries:</b> {s.industries.join(", ")}</p>
          </div>
        </div>
      </Section>
      {gallery.length > 0 && (
        <Section>
          <Heading label="Gallery" title={<>{s.title} <Lime>work</Lime></>} sub="A selection of our work. Click any image to view it larger." />
          <div className="mt-10"><ServiceGallery images={gallery} /></div>
        </Section>
      )}
      {gallery.length === 0 && <Section>
        <Heading label="Examples" title={<>Example <Lime>projects</Lime></>} />
        <div className="mt-10 grid gap-5 md:grid-cols-3">{examples.length ? examples.map((p) => <ProjectCard key={p.id} p={p} />) : <p className="text-mute">Examples for this service will appear here as projects are published.</p>}</div>
      </Section>}
      <Section light>
        <Heading light label="Related packages" title={`${s.title} is included in every package.`} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{packages.filter((p) => s.related.includes(p.slug)).map((p) => <PackageCard key={p.slug} p={p} light />)}</div>
      </Section>
      <Section>
        <Heading label="FAQ" title={<>{s.title} <Lime>questions</Lime></>} />
        <div className="mt-10 max-w-4xl"><FaqList items={s.faqs} /></div>
        <JsonLd data={faqJsonLd(s.faqs)} />
      </Section>
      <CtaBand />
    </>
  );
}
