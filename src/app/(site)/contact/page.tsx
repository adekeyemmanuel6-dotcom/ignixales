import type { Metadata } from "next";
import { getSettings } from "@/lib/content";
import { meta } from "@/lib/seo";
import { PageHero } from "@/components/site/blocks";
import { Section, Lime } from "@/components/ui/Section";
import { SimpleForm, type Field } from "@/components/site/SimpleForm";
import { Btn, Arrow } from "@/components/ui/Button";

export const metadata: Metadata = meta("Contact Ignixales | E-commerce Campaign Creative Studio", "Get in touch with Ignixales about banner design, flyers, social media design or email copywriting for your next campaign.", "/contact");

const fields: Field[] = [
  { name: "name", label: "Name", required: true }, { name: "email", label: "Email", type: "email", required: true },
  { name: "business", label: "Business name" }, { name: "subject", label: "Subject", required: true },
  { name: "service", label: "Service of interest", type: "select", options: ["Banner design", "Flyer & promotional design", "Email copywriting", "Social media design", "Full campaign package", "Not sure yet"] },
  { name: "budget", label: "Budget range", type: "select", options: ["Under $100", "$100 – $250", "$250 – $500", "$500+", "Not sure yet"] },
  { name: "message", label: "Message", type: "textarea", required: true },
];

export default async function Contact() {
  const s = await getSettings();
  return (
    <>
      <PageHero label="Contact" title={<>Let’s talk about your <Lime>next campaign.</Lime></>} sub="Questions, custom quotes or just not sure where to start? Send us a message." />
      <Section className="!pt-0">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <SimpleForm endpoint="/api/contact" fields={fields} submit="Send message" event="contact_submit" successTitle="Message sent" successText={`Thanks for getting in touch. ${s.responseTime}`} />
          <aside className="space-y-6">
            <div className="card p-6"><h2 className="label">Get in touch</h2>
              <dl className="mt-4 space-y-4 text-sm"><div><dt className="text-mute">Email</dt><dd><a className="text-lg font-semibold hover:text-lime" href={`mailto:${s.email}`}>{s.email}</a></dd></div>
                {s.location && <div><dt className="text-mute">Location</dt><dd>{s.location}</dd></div>}
                <div><dt className="text-mute">Response time</dt><dd>{s.responseTime}</dd></div>
                {s.socials.some((x) => x.url) && <div><dt className="text-mute">Social</dt><dd className="mt-1 flex flex-wrap gap-2">{s.socials.filter((x) => x.url).map((x) => <a key={x.label} href={x.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-3 py-1 hover:border-lime hover:text-lime">{x.label}</a>)}</dd></div>}</dl></div>
            <div className="card border-lime/30 bg-lime/5 p-6"><h2 className="font-display text-2xl uppercase">Ready to go?</h2><p className="mt-2 text-sm text-mute">Skip the back-and-forth and send your brief and assets directly.</p><Btn href="/start-project" className="mt-4">Start a project <Arrow /></Btn></div>
          </aside>
        </div>
      </Section>
    </>
  );
}
