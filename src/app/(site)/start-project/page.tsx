import type { Metadata } from "next";
import { getAddons, getPackages, getSettings } from "@/lib/content";
import { meta } from "@/lib/seo";
import { PageHero } from "@/components/site/blocks";
import { Section, Lime } from "@/components/ui/Section";
import { ProjectWizard } from "@/components/site/ProjectWizard";

export const metadata: Metadata = meta("Start a Project | Ignixales", "Choose a package, submit your campaign brief and upload your brand assets in a few simple steps.", "/start-project");

export default async function StartProject({ searchParams }: { searchParams: Promise<{ package?: string; campaign?: string; service?: string }> }) {
  const [sp, packages, addons, settings] = await Promise.all([searchParams, getPackages(), getAddons(), getSettings()]);
  return (
    <>
      <PageHero className="!pb-10 sm:!pb-12" label="Start a project" title={<>Tell us about your <Lime>campaign.</Lime></>} sub="Seven short steps: pick a package, share your brief and upload your assets." />
      <Section className="!pt-4"><ProjectWizard packages={packages} addons={addons} initial={sp} responseTime={settings.responseTime} /></Section>
    </>
  );
}
