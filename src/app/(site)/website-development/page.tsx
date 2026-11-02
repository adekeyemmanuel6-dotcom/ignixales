import type { Metadata } from "next";
import { meta } from "@/lib/seo";
import { PageHero } from "@/components/site/blocks";
import { Section, Lime } from "@/components/ui/Section";
import { SimpleForm, type Field } from "@/components/site/SimpleForm";

export const metadata: Metadata = meta("Website Design & Development Request | Ignixales", "Looking to build or redesign your e-commerce website? Send a website design and development enquiry.", "/website-development");

const fields: Field[] = [
  { name: "name", label: "Name", required: true }, { name: "business", label: "Business name", required: true },
  { name: "email", label: "Email", type: "email", required: true }, { name: "existingSite", label: "Existing website", type: "url", placeholder: "https://" },
  { name: "platform", label: "Website platform preference", type: "select", options: ["Shopify", "WooCommerce", "WordPress", "Custom build", "Not sure yet"] },
  { name: "projectType", label: "Type of project", type: "select", required: true, options: ["New e-commerce website", "Website redesign", "Landing page", "Store improvements", "Other"] },
  { name: "features", label: "Required features", type: "textarea" },
  { name: "budget", label: "Project budget", type: "select", options: ["Under $500", "$500 – $1,500", "$1,500 – $5,000", "$5,000+", "Not sure yet"] },
  { name: "description", label: "Project description", type: "textarea", required: true },
];

export default function WebsiteDev() {
  return (
    <>
      <PageHero label="Secondary service" title={<>Need more than <Lime>campaign creative?</Lime></>} sub="Looking to build or redesign your e-commerce website? Tell us about your project and we’ll direct your request to the right team." />
      <Section className="!pt-0">
        <div className="max-w-3xl">
          <h2 className="h-display mb-6 text-3xl">Request website design &amp; development</h2>
          <SimpleForm endpoint="/api/website-request" fields={fields} submit="Request website design & development" event="website_enquiry_submit" successTitle="Request received" successText="Thanks. We will review your project and direct it to the right team." />
          <p className="mt-6 text-sm text-mute">Ignixales is primarily an e-commerce campaign creative studio. Website work is handled as a separate enquiry and is not part of our campaign packages.</p>
        </div>
      </Section>
    </>
  );
}
