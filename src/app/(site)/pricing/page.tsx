import type { Metadata } from "next";
import Link from "next/link";
import { getAddons, getPackages } from "@/lib/content";
import { meta } from "@/lib/seo";
import { PageHero, CtaBand, FaqList, JsonLd, PackageCard, faqJsonLd } from "@/components/site/blocks";
import { Section, Lime, Heading } from "@/components/ui/Section";
import { Btn, Arrow } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { cn, money } from "@/lib/utils";

export const metadata: Metadata = meta("E-commerce Campaign Design Pricing & Packages | Ignixales", "Compare four clear campaign creative packages for e-commerce brands: banners, flyers, social media designs and email copy, plus optional add-ons.", "/pricing");

const pricingFaqs = [
  { q: "Are these prices final?", a: "Package prices are starting prices shown on this page. If your project needs something outside a package, we will confirm any difference with you before work begins." },
  { q: "Can I add extras to a package?", a: "Yes. Add-ons are selected in the project form alongside a package or an individual service request." },
  { q: "Can I upgrade to a bigger package later?", a: "Yes. If your needs grow after you start, tell us and we will work out the difference with you." },
  { q: "How do I pay?", a: "After you submit your brief we review it and confirm the details and payment instructions with you directly. You are not charged when you submit the form." },
  { q: "Can I get a custom package?", a: "Yes. Choose 'Custom Package' in the project form or use the custom quote button below." },
];

export default async function Pricing() {
  const [packages, addons] = await Promise.all([getPackages(), getAddons()]);
  const rows: [string, (p: (typeof packages)[number]) => string][] = [
    ["Promotional banners", (p) => String(p.qty.banner)], ["Promotional flyers", (p) => String(p.qty.flyer)], ["Social media designs", (p) => String(p.qty.social)],
    ["Promotional email copies", (p) => String(p.qty.email)], ["Revision allowance", (p) => p.revisions], ["Typical delivery", (p) => p.delivery], ["Starting price", (p) => money(p.price, p.currency)],
  ];
  return (
    <>
      <PageHero label="Pricing" title={<>The right creative package for <Lime>every campaign.</Lime></>} sub="Four packages, clear deliverables, no surprises. Pick one, add extras if you need them, and send your brief." />
      <Section className="!pt-0">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{packages.map((p) => <PackageCard key={p.slug} p={p} />)}</div>
        <p className="mt-8 text-center text-sm text-mute">Need something different? <Link href="/start-project?package=custom" className="text-lime underline">Request a custom campaign package.</Link></p>
      </Section>
      <Section tone="surface">
        <Heading label="Compare" title={<>Package <Lime>comparison</Lime></>} />
        <div className="-mx-5 mt-10 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead><tr><th className="p-4"><span className="sr-only">Feature</span></th>{packages.map((p) => <th key={p.slug} scope="col" className={cn("p-4 font-display text-xl uppercase", p.recommended && "rounded-t-xl bg-lime text-black")}>{p.name}</th>)}</tr></thead>
            <tbody>{rows.map(([l, f], ri) => <tr key={l} className="border-t border-white/10"><th scope="row" className="p-4 font-medium text-white/80">{l}</th>{packages.map((p) => <td key={p.slug} className={cn("p-4", p.recommended && "bg-lime/10", ri === rows.length - 1 && "font-display text-2xl")}>{f(p)}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-mute">Pro and Complete also include coordinated campaign creative direction; Complete adds multiple campaign variations. See each package above for the full list.</p>
      </Section>
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Heading label="Add-ons" title={<>Optional <Lime>extras</Lime></>} sub="Add extras to a package or an individual service request when you submit your project." />
            <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
              {addons.map((a) => <li key={a.id} className="flex items-center justify-between gap-4 py-4"><span>{a.name}{a.note && <span className="ml-2 text-xs text-mute">({a.note})</span>}</span><span className="font-display text-2xl text-lime">+{money(a.price)}</span></li>)}
            </ul>
          </div>
          <Reveal className="card h-fit p-8">
            <h2 className="h-display text-4xl">Custom package</h2>
            <p className="mt-3 text-mute">Planning something bigger, ongoing or unusual? Tell us what you have in mind and we will put together a custom quote.</p>
            <Btn href="/start-project?package=custom" className="mt-6">Get a custom quote <Arrow /></Btn>
            <h3 className="h-display mt-10 text-2xl">Upgrade options</h3>
            <p className="mt-2 text-sm text-mute">Start with a smaller package and move up when you are ready. Extra banners, flyers, social graphics, email copy, revisions and campaign variations are all available as add-ons.</p>
          </Reveal>
        </div>
      </Section>
      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]"><Heading label="Pricing FAQ" title={<>Pricing <Lime>questions</Lime></>} /><FaqList items={pricingFaqs} /></div>
        <JsonLd data={faqJsonLd(pricingFaqs)} />
      </Section>
      <CtaBand />
    </>
  );
}
