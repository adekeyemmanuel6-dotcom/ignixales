export type ArtKind =
  | "black-friday" | "christmas" | "new-year" | "fashion" | "skincare"
  | "homepage" | "email" | "electronics" | "social" | "flyer" | "jewellery" | "home";

export type Package = {
  slug: string;
  name: string;
  bestFor: string;
  price: number;
  currency: string;
  deliverables: string[];
  revisions: string;
  delivery: string;
  recommended: boolean;
  enabled: boolean;
  /** quantities used by the order form + price estimate */
  qty: { banner: number; flyer: number; social: number; email: number };
};

export type Addon = { id: string; name: string; price: number; note?: string; unit: keyof Package["qty"] | null; enabled: boolean };

export type Stat = { id: string; value: string; suffix: string; label: string };

export type Faq = { q: string; a: string };

export type ServiceSlug = "banner-design" | "flyer-design" | "email-copywriting" | "social-media-design";

export type Service = {
  slug: ServiceSlug;
  index: string;
  title: string;
  short: string;
  long: string;
  art: ArtKind;
  deliverables: string[];
  industries: string[];
  benefits: string[];
  related: string[]; // package slugs
  seoTitle: string;
  seoDescription: string;
  faqs: Faq[];
  note?: string;
};

export type CampaignSlug = "black-friday" | "christmas" | "new-year";

export type Campaign = {
  slug: CampaignSlug;
  name: string;
  headline: string;
  intro: string;
  blurb: string;
  cta: string;
  theme: "bf" | "xmas" | "ny";
  art: ArtKind;
  styleNote: string;
  showcase: { title: string; text: string }[];
  recommendedPackage: string;
  seoTitle: string;
  seoDescription: string;
  faqs: Faq[];
};

export type Settings = {
  email: string;
  location: string;
  responseTime: string;
  socials: { label: string; url: string }[];
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  client_name: string | null;
  industry: string | null;
  campaign_type: string | null;
  service_category: string | null;
  description: string | null;
  objective: string | null;
  creative_direction: string | null;
  deliverables: string[];
  cover_url: string | null;
  video_url: string | null;
  project_date: string | null;
  featured: boolean;
  is_concept: boolean;
  related_services: string[];
  related_package: string | null;
  tags: string[];
  images: { id: string; url: string; kind: string; caption: string | null }[];
  art?: ArtKind; // used only by built-in concept samples that have no uploaded image
};

export type Testimonial = {
  id: string; name: string; company: string | null; role: string | null; quote: string; photo_url: string | null;
};

export type TeamMember = { name: string; role: string; bio: string; photo: string };
