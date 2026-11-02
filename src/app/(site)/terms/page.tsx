import type { Metadata } from "next";
import { meta } from "@/lib/seo";
import { PageHero } from "@/components/site/blocks";
import { Section } from "@/components/ui/Section";
export const metadata: Metadata = meta("Terms & Conditions | Ignixales", "Terms and conditions for Ignixales creative services.", "/terms");
export default function Terms() {
  return (<><PageHero label="Legal" title="Terms & Conditions" /><Section className="!pt-0"><div className="max-w-3xl space-y-5 text-mute">
    <p className="rounded-lg border border-lime/30 bg-lime/5 p-4 text-sm text-lime">Template text: have this reviewed and completed by a qualified professional before publishing.</p>
    <h2 className="font-display text-2xl uppercase text-white">Services</h2><p>Ignixales provides e-commerce campaign creative: banner design, flyer design, social media design and email copywriting. The scope of each project is described by the package or quote agreed with you.</p>
    <h2 className="font-display text-2xl uppercase text-white">Orders &amp; payment</h2><p>Submitting the project form is a request, not a payment. We confirm scope, price and payment details with you before work begins. Prices shown on the site are starting prices.</p>
    <h2 className="font-display text-2xl uppercase text-white">Your materials</h2><p>You confirm you have the rights to use all logos, images and text you upload. We use your files only to deliver your project.</p>
    <h2 className="font-display text-2xl uppercase text-white">Revisions</h2><p>Each package includes the revision rounds listed for it. Additional rounds can be purchased.</p>
    <h2 className="font-display text-2xl uppercase text-white">Ownership</h2><p>[Describe ownership and licence of final deliverables, and portfolio display rights.]</p>
    <h2 className="font-display text-2xl uppercase text-white">Contact</h2><p>Questions about these terms? Use the contact page.</p></div></Section></>);
}
