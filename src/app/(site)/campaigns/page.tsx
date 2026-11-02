import type { Metadata } from "next";
import Link from "next/link";
import { getCampaigns } from "@/lib/content";
import { meta } from "@/lib/seo";
import { PageHero, CtaBand } from "@/components/site/blocks";
import { Section, Lime } from "@/components/ui/Section";
import { Arrow } from "@/components/ui/Button";
import { CampaignArt } from "@/components/ui/CampaignArt";

export const metadata: Metadata = meta("Seasonal Marketing Creative Services | Ignixales", "Black Friday, Christmas and New Year campaign design for e-commerce brands: banners, flyers, social creatives and email copy.", "/campaigns");

export default async function Campaigns() {
  const campaigns = await getCampaigns();
  return (
    <>
      <PageHero label="Seasonal campaigns" title={<>Make every sales <Lime>season count.</Lime></>} sub="Dedicated creative support for the three biggest e-commerce sales seasons." />
      <Section><div className="grid gap-5 lg:grid-cols-3">{campaigns.map((c) => (
        <Link key={c.slug} href={`/campaigns/${c.slug}`} className="group card overflow-hidden transition hover:border-lime/50">
          <div className="aspect-[4/3] overflow-hidden"><div className="h-full transition duration-700 group-hover:scale-105"><CampaignArt kind={c.art} /></div></div>
          <div className="p-6"><h2 className="font-display text-4xl uppercase">{c.name}</h2><p className="mt-2 text-sm text-mute">{c.blurb}</p><span className="link-arrow mt-5">{c.cta}<Arrow /></span></div>
        </Link>))}</div></Section>
      <CtaBand />
    </>
  );
}
