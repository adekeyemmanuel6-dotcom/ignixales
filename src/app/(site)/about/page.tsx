import type { Metadata } from "next";
import Image from "next/image";
import { getTeam } from "@/lib/content";
import { industries } from "@/lib/defaults";
import { meta } from "@/lib/seo";
import { PageHero, CtaBand, ProcessSteps } from "@/components/site/blocks";
import { Section, Lime, Heading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CampaignArt } from "@/components/ui/CampaignArt";
import { Btn, Arrow } from "@/components/ui/Button";

export const metadata: Metadata = meta("About Ignixales | E-commerce Campaign Creative Studio", "Ignixales is a creative partner for online retailers, creating cohesive seasonal promotional campaigns with creative thinking and e-commerce understanding.", "/about");

const principles = [["Creative thinking", "Ideas first, so campaigns feel distinctive rather than templated."], ["E-commerce understanding", "We design for how online shoppers browse, compare and buy."], ["Attention to detail", "Hierarchy, spacing, copy and consistency across every asset."], ["Consistent visual communication", "Banners, flyers, social and email that clearly belong together."], ["Simple client experience", "One brief, one upload area, clear next steps."]];

export default async function About() {
  const team = await getTeam();
  return (
    <>
      <PageHero label="About us" title={<>Creative thinking. E-commerce focus. <Lime>Campaigns that stand out.</Lime></>}><Btn href="/start-project">Start a project <Arrow /></Btn></PageHero>
      <Section tone="surface">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div><p className="label">Who we are</p><h2 className="h-display mt-3 text-[clamp(2.2rem,5vw,3.6rem)]">Ignite X Sales.</h2>
            <p className="mt-5 text-white/85">Ignixales is an e-commerce creative and campaign design studio. The name says what we are here for: to ignite your sales.</p>
            <p className="mt-4 text-mute">We exist because seasonal promotions often end up as a patchwork: a banner from one place, a flyer from another, emails written separately. We bring banners, flyers, social creatives and email copy into one coordinated campaign, so your brand shows up consistently wherever customers meet it.</p></div>
          <Reveal className="grid grid-cols-2 gap-3"><div className="aspect-[3/4] overflow-hidden rounded-card"><CampaignArt kind="black-friday" /></div><div className="mt-10 aspect-[3/4] overflow-hidden rounded-card"><CampaignArt kind="christmas" /></div></Reveal>
        </div>
      </Section>
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal className="card p-8"><p className="label">Mission</p><p className="mt-3 font-display text-3xl uppercase leading-tight">Help e-commerce brands make every sales season count with creative that looks great and communicates clearly.</p></Reveal>
          <Reveal delay={100} className="card p-8"><p className="label">Vision</p><p className="mt-3 font-display text-3xl uppercase leading-tight">To be the creative partner online retailers trust for their seasonal campaigns.</p></Reveal>
        </div>
      </Section>
      <Section tone="surface">
        <Heading label="Creative philosophy" title={<>What we <Lime>care about</Lime></>} />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{principles.map(([t, d], i) => <Reveal key={t} delay={i * 60} className="card p-5"><span className="h-display text-3xl text-lime">0{i + 1}</span><h3 className="mt-3 font-display text-xl uppercase">{t}</h3><p className="mt-2 text-sm text-mute">{d}</p></Reveal>)}</div>
      </Section>
      <Section><Heading label="How the studio works" title={<>Brief in. <Lime>Campaign out.</Lime></>} /><div className="mt-12"><ProcessSteps /></div></Section>
      <Section tone="surface"><Heading label="Industries" title={<>Who we <Lime>work with</Lime></>} sub="Online retailers selling on Shopify, WooCommerce and similar platforms." />
        <ul className="mt-10 flex flex-wrap gap-3">{industries.map((i) => <li key={i} className="rounded-full border border-white/20 px-5 py-2.5 font-display text-xl uppercase">{i}</li>)}</ul></Section>
      {team.length > 0 && (
        <Section><Heading label="Team" title={<>The people <Lime>behind it</Lime></>} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{team.map((m) => (
            <Reveal key={m.name} className="card overflow-hidden">{m.photo ? <Image src={m.photo} alt={m.name} width={600} height={600} className="aspect-square w-full object-cover" /> : <div className="grid aspect-square place-items-center bg-surface font-display text-7xl text-lime">{m.name[0]}</div>}
              <div className="p-5"><h3 className="font-display text-2xl uppercase">{m.name}</h3><p className="text-sm text-lime">{m.role}</p><p className="mt-2 text-sm text-mute">{m.bio}</p></div></Reveal>))}</div></Section>
      )}
      <CtaBand />
    </>
  );
}
