import type { Metadata } from "next";
import { meta } from "@/lib/seo";
import { PageHero } from "@/components/site/blocks";
import { Section } from "@/components/ui/Section";
export const metadata: Metadata = meta("Privacy Policy | Ignixales", "How Ignixales collects, uses and protects your information.", "/privacy");
export default function Privacy() {
  return (<><PageHero label="Legal" title="Privacy Policy" /><Section className="!pt-0"><div className="max-w-3xl space-y-5 text-mute">
    <p className="rounded-lg border border-lime/30 bg-lime/5 p-4 text-sm text-lime">Template text: have this reviewed and completed by a qualified professional before publishing.</p>
    <h2 className="font-display text-2xl uppercase text-white">What we collect</h2><p>Details you submit through our forms (name, business, email, campaign information) and the files you upload with a project.</p>
    <h2 className="font-display text-2xl uppercase text-white">How we use it</h2><p>To respond to your enquiry, deliver your project and communicate with you about it. Uploaded files are stored privately and are accessible only to the Ignixales team.</p>
    <h2 className="font-display text-2xl uppercase text-white">Cookies &amp; analytics</h2><p>Optional analytics and advertising cookies (Google Analytics, Google Tag Manager, Meta Pixel) only load after you accept them in the cookie banner. You can decline.</p>
    <h2 className="font-display text-2xl uppercase text-white">Service providers</h2><p>We use Supabase (database and file storage) and an email provider to operate the site.</p>
    <h2 className="font-display text-2xl uppercase text-white">Your rights</h2><p>[Add your data-retention period and how to request access or deletion, according to the laws of the markets you serve (e.g. UK/EU GDPR, CCPA).]</p></div></Section></>);
}
