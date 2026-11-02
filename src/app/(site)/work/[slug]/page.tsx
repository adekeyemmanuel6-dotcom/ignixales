import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProject, getProjects } from "@/lib/content";
import { meta } from "@/lib/seo";
import { CtaBand, ProjectCard } from "@/components/site/blocks";
import { Section, Lime, Check, Heading } from "@/components/ui/Section";
import { Btn, Arrow } from "@/components/ui/Button";
import { CampaignArt } from "@/components/ui/CampaignArt";
import { Reveal } from "@/components/ui/Reveal";
import { labelize } from "@/lib/utils";

type P = { params: Promise<{ slug: string }> };
export const revalidate = 60;
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = await getProject((await params).slug);
  return p ? meta(`${p.title} | ${labelize(p.campaign_type) || "Campaign"} Project | Ignixales`, p.description || `${p.title}, an e-commerce campaign project by Ignixales.`, `/work/${p.slug}`) : {};
}

export default async function ProjectPage({ params }: P) {
  const p = await getProject((await params).slug);
  if (!p) notFound();
  const { projects } = await getProjects();
  const related = projects.filter((x) => x.id !== p.id && (x.campaign_type === p.campaign_type || x.industry === p.industry)).slice(0, 3);
  const before = p.images.find((i) => i.kind === "before"), after = p.images.find((i) => i.kind === "after");
  const gallery = p.images.filter((i) => i.kind !== "before" && i.kind !== "after");
  const isVideoFile = p.video_url && /\.(mp4|webm)(\?|$)/i.test(p.video_url);
  const meta2 = [["Brand", p.client_name], ["Industry", labelize(p.industry)], ["Campaign", labelize(p.campaign_type)], ["Service", labelize(p.service_category)], ["Date", p.project_date]].filter(([, v]) => v);
  return (
    <>
      <section className="bg-ink pb-12 pt-32 sm:pt-40">
        <div className="container-x">
          <p className="label">{p.is_concept ? "Concept project" : "Client project"}</p>
          <h1 className="h-display mt-3 max-w-5xl text-[clamp(2.6rem,7vw,5.5rem)]">{p.title}</h1>
          <Reveal className="relative mt-10 aspect-[16/9] overflow-hidden rounded-card border border-white/10">
            {p.cover_url ? <Image src={p.cover_url} alt={p.title} fill priority sizes="100vw" className="object-cover" /> : <CampaignArt kind={p.art ?? "homepage"} concept={p.is_concept} />}
          </Reveal>
        </div>
      </section>
      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-10">
            <div><h2 className="label !text-white/50">Project overview</h2><p className="mt-3 text-lg text-white/85">{p.description}</p></div>
            {p.objective && <div><h2 className="label !text-white/50">Campaign objective</h2><p className="mt-3 text-mute">{p.objective}</p></div>}
            {p.creative_direction && <div><h2 className="label !text-white/50">Creative direction</h2><p className="mt-3 text-mute">{p.creative_direction}</p></div>}
          </div>
          <aside className="card h-fit p-6">
            <dl className="space-y-3 text-sm">{meta2.map(([k, v]) => <div key={k} className="flex justify-between gap-4 border-b border-white/10 pb-3 last:border-0"><dt className="text-mute">{k}</dt><dd className="text-right font-medium">{v}</dd></div>)}</dl>
            {p.deliverables.length > 0 && <><h2 className="label mt-6 !text-white/50">Deliverables</h2><ul className="mt-3 space-y-2 text-sm">{p.deliverables.map((d) => <li key={d} className="flex gap-2.5"><Check />{d}</li>)}</ul></>}
          </aside>
        </div>
      </Section>
      {(gallery.length > 0 || isVideoFile) && (
        <Section><Heading label="Gallery" title={<>The <Lime>creative</Lime></>} />
          <div className="mt-10 space-y-5">
            {isVideoFile && <video className="w-full rounded-card" controls preload="metadata" src={p.video_url!} />}
            {p.video_url && !isVideoFile && <a className="link-arrow" href={p.video_url} target="_blank" rel="noopener noreferrer">Watch video preview <Arrow /></a>}
            {gallery.map((g) => <Reveal key={g.id}><figure><Image src={g.url} alt={g.caption || p.title} width={1920} height={1080} sizes="100vw" className="h-auto w-full rounded-card" />{g.caption && <figcaption className="mt-2 text-xs text-mute">{g.caption}</figcaption>}</figure></Reveal>)}
          </div></Section>
      )}
      {before && after && (
        <Section tone="surface"><Heading label="Before & after" title={<>The <Lime>difference</Lime></>} />
          <div className="mt-10 grid gap-5 md:grid-cols-2">{[["Before", before], ["After", after]].map(([l, i]) => <figure key={l as string}><Image src={(i as typeof before).url} alt={`${l} – ${p.title}`} width={1200} height={900} className="h-auto w-full rounded-card" /><figcaption className="mt-2 text-sm text-mute">{l as string}</figcaption></figure>)}</div></Section>
      )}
      {related.length > 0 && <Section><Heading label="Related projects" title={<>More <Lime>work</Lime></>} /><div className="mt-10 grid gap-5 md:grid-cols-3">{related.map((r) => <ProjectCard key={r.id} p={r} />)}</div></Section>}
      <CtaBand title={<>Want a campaign like <Lime>this?</Lime></>} sub="Tell us about your next sales season and we will get started." />
      <div className="bg-ink pb-16 text-center"><Btn href={`/start-project${p.related_package ? `?package=${p.related_package}` : ""}`}>Start a similar campaign <Arrow /></Btn></div>
    </>
  );
}
