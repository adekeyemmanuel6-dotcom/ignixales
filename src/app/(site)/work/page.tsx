import type { Metadata } from "next";
import { getAllServiceImages, getProjects } from "@/lib/content";
import { WorkImages } from "@/components/site/WorkImages";
import { meta } from "@/lib/seo";
import { PageHero, CtaBand } from "@/components/site/blocks";
import { Section, Lime } from "@/components/ui/Section";
import { WorkGallery } from "@/components/site/WorkGallery";
import { Btn } from "@/components/ui/Button";

export const metadata: Metadata = meta("Our Work | E-commerce Campaign Design Portfolio | Ignixales", "Browse Black Friday, Christmas and New Year campaign projects: banners, flyers, social media creatives and email copy for e-commerce brands.", "/work");
export const revalidate = 60;

export default async function Work() {
  const [{ projects, fromDb }, { pool }] = await Promise.all([getProjects(), getAllServiceImages()]);
  return (
    <>
      <PageHero label="Our work" title={<>A look at <Lime>what we create.</Lime></>} sub="Campaign banners, flyers, social creatives and email copy. Filter by season, service or industry.">
        <Btn href="/start-project">Start a similar project</Btn>
      </PageHero>
      <Section>
        {!fromDb && pool.length > 0 ? <WorkImages images={pool} /> : <WorkGallery projects={projects} />}
        {!fromDb && !pool.length && <p className="mt-8 text-xs text-mute">These are concept designs created by Ignixales to show what a coordinated campaign can look like. They are not completed client work.</p>}
      </Section>
      <CtaBand />
    </>
  );
}
