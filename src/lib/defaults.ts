import type { Package, Addon, Stat, Faq, Service, Campaign, Settings, Project, TeamMember } from "./types";

/**
 * DEFAULT CONTENT.
 * Everything here is overridable from /admin (stored in the `site_content` table).
 * If Supabase is not configured the site runs entirely from these defaults.
 *
 * PRICES BELOW ARE PROPOSED STARTING VALUES – review before publishing.
 * Delivery times and add-on prices are suggestions, not commitments.
 */

export const defaultPackages: Package[] = [
  {
    slug: "starter-creative", name: "Starter Creative", price: 50, currency: "USD", recommended: false, enabled: true,
    bestFor: "Brands that need a few essential promotional assets.",
    deliverables: ["1 promotional banner", "1 promotional flyer", "2 social media designs", "1 promotional email copy", "1 revision round"],
    revisions: "1 revision round", delivery: "3–5 business days",
    qty: { banner: 1, flyer: 1, social: 2, email: 1 },
  },
  {
    slug: "growth-campaign", name: "Growth Campaign", price: 100, currency: "USD", recommended: false, enabled: true,
    bestFor: "Growing e-commerce brands preparing a coordinated promotion.",
    deliverables: ["2 promotional banners", "2 promotional flyers", "4 social media designs", "2 promotional email copies", "2 revision rounds"],
    revisions: "2 revision rounds", delivery: "4–6 business days",
    qty: { banner: 2, flyer: 2, social: 4, email: 2 },
  },
  {
    slug: "pro-campaign", name: "Pro Campaign", price: 150, currency: "USD", recommended: true, enabled: true,
    bestFor: "Established stores that need a more complete seasonal campaign.",
    deliverables: ["3 promotional banners", "3 promotional flyers", "6 social media designs", "3 promotional email copies", "2 revision rounds", "Coordinated campaign visual direction"],
    revisions: "2 revision rounds", delivery: "5–7 business days",
    qty: { banner: 3, flyer: 3, social: 6, email: 3 },
  },
  {
    slug: "complete-campaign", name: "Complete Campaign", price: 250, currency: "USD", recommended: false, enabled: true,
    bestFor: "Brands that want a comprehensive seasonal creative package.",
    deliverables: ["5 promotional banners", "4 promotional flyers", "10 social media designs", "5 promotional email copies", "Campaign creative direction", "Multiple campaign variations", "3 revision rounds"],
    revisions: "3 revision rounds", delivery: "7–10 business days",
    qty: { banner: 5, flyer: 4, social: 10, email: 5 },
  },
];

export const defaultAddons: Addon[] = [
  { id: "extra-banner", name: "Extra banner", price: 20, unit: "banner", enabled: true },
  { id: "extra-flyer", name: "Extra flyer", price: 20, unit: "flyer", enabled: true },
  { id: "extra-social", name: "Extra social media graphic", price: 10, unit: "social", enabled: true },
  { id: "extra-email", name: "Additional email copy", price: 15, unit: "email", enabled: true },
  { id: "extra-revision", name: "Additional revision round", price: 15, unit: null, enabled: true },
  { id: "rush", name: "Rush delivery", price: 40, unit: null, note: "Subject to availability", enabled: true },
  { id: "variation", name: "Additional campaign variation", price: 25, unit: null, enabled: true },
];

/** Leave `value` empty until verified numbers exist. Empty values render as [NUMBER] placeholders. */
export const defaultStats: Stat[] = [
  { id: "projects", value: "", suffix: "+", label: "Creative Projects" },
  { id: "assets", value: "", suffix: "+", label: "Campaign Assets Delivered" },
  { id: "brands", value: "", suffix: "+", label: "Brands Supported" },
  { id: "satisfaction", value: "", suffix: "%", label: "Client Satisfaction" },
];

export const defaultFaqs: Faq[] = [
  { q: "What services does Ignixales offer?", a: "We design promotional banners, flyers and social media creatives, and write promotional email copy, all built around seasonal e-commerce campaigns such as Black Friday, Christmas and New Year." },
  { q: "Do you work exclusively with e-commerce brands?", a: "E-commerce is our focus and everything we offer is shaped around online retail. If you run a different kind of business with a promotional campaign, send a brief or request a custom package and we will let you know whether we are a good fit." },
  { q: "Which industries do you work with?", a: "Fashion and clothing, beauty and skincare, electronics and gadgets, jewellery and accessories, home and lifestyle, and other online retailers selling on Shopify, WooCommerce or similar platforms." },
  { q: "What is included in each package?", a: "Each package lists its banners, flyers, social media designs and email copies, plus its revision allowance. You can compare all four side by side on the pricing page, and add extras if you need more." },
  { q: "Can I request a custom package?", a: "Yes. Choose 'Custom Package' when you start a project, or use the custom quote link on the pricing page, and describe what you need." },
  { q: "Can I upload my own product images and brand assets?", a: "Yes. The project form includes a secure upload area for your logo, brand guidelines, product photos, existing designs and references (PNG, JPG, WEBP, SVG, PDF and ZIP)." },
  { q: "How long does a project take?", a: "Each package shows a typical delivery time. The exact timeline is confirmed once we have reviewed your brief and assets, and depends on the scope and how quickly feedback comes back." },
  { q: "How many revisions are included?", a: "Starter includes 1 revision round, Growth and Pro include 2, and Complete includes 3. Additional revision rounds can be added." },
  { q: "Do you design Black Friday campaigns?", a: "Yes. Black Friday is one of our core seasonal specialities, including Cyber Monday variations." },
  { q: "Do you create Christmas and New Year campaigns?", a: "Yes. We have dedicated campaign pages for Christmas and New Year, covering banners, flyers, social creatives and email copy." },
  { q: "Do you write promotional email copy?", a: "Yes. Email copywriting covers subject lines, preview text and the full promotional email copy. Note this is written copy, not email graphic design." },
  { q: "Can I order only banner designs?", a: "Yes. Choose 'Individual Service Request' when starting a project and tell us which services and quantities you need." },
  { q: "Do you offer ongoing creative support?", a: "If you need creative support across several sales seasons, tell us on a custom quote request and we will discuss what ongoing support could look like." },
  { q: "Can you design my website too?", a: "Website design and development is not part of our core campaign packages, but you can send us a separate enquiry through the website development request page and we will direct it to the right team." },
];

export const defaultSettings: Settings = {
  email: "hello@ignixales.com",
  location: "",
  responseTime: "We aim to reply within 1 business day.",
  socials: [
    { label: "Instagram", url: "" },
    { label: "Facebook", url: "" },
    { label: "LinkedIn", url: "" },
    { label: "Behance", url: "" },
  ],
};

const std = (s: string, label: string): { q: string; a: string }[] => [
  { q: `What do I need to provide for ${label}?`, a: "Your logo, product images, offer details and any brand guidelines or references. The project form guides you through each step and lets you upload files securely." },
  { q: "How many revisions do I get?", a: "That depends on your package: 1 round on Starter, 2 on Growth and Pro, 3 on Complete. Extra rounds can be added." },
  { q: `Can I order ${s} on its own?`, a: "Yes. Choose 'Individual Service Request' in the project form and list what you need." },
];

export const defaultServices: Service[] = [
  {
    slug: "banner-design", index: "01", title: "Banner Design", art: "homepage",
    short: "High-impact promotional banners for your store, built for desktop and mobile.",
    long: "Your banner is often the first thing a shopper sees. We design promotional banners that communicate your offer instantly, carry your brand and guide visitors to the right collection or product, with layouts prepared for both desktop and mobile.",
    deliverables: ["Shopify homepage banners", "Website hero sections", "Collection page banners", "Product promotions", "Sale announcements", "Desktop and mobile layouts"],
    industries: ["Fashion", "Beauty", "Electronics", "Lifestyle", "Home", "Accessories"],
    benefits: ["Clear offer hierarchy", "Desktop and mobile versions", "Consistent with your campaign visuals"],
    related: ["starter-creative", "growth-campaign", "pro-campaign", "complete-campaign"],
    seoTitle: "E-commerce Banner Design | Ignixales",
    seoDescription: "Promotional banner design for Shopify and WooCommerce stores: homepage banners, hero sections and sale announcements for desktop and mobile.",
    faqs: std("banner design", "banner design"),
  },
  {
    slug: "flyer-design", index: "02", title: "Flyer & Promotional Design", art: "flyer",
    short: "Creative flyers and promotional graphics for sales, launches and gift guides.",
    long: "From discount flyers to gift guides, we design promotional pieces that make your offer easy to understand and hard to ignore, in layouts you can use digitally or share with customers.",
    deliverables: ["Sale announcements", "Discount promotions", "Product launches", "Holiday promotions", "Promotional posters", "Gift guides"],
    industries: ["Fashion", "Beauty", "Home", "Lifestyle", "Accessories"],
    benefits: ["Strong visual hierarchy", "On-brand typography and colour", "Print-ready or digital formats on request"],
    related: ["starter-creative", "growth-campaign", "pro-campaign", "complete-campaign"],
    seoTitle: "Promotional Flyer Design for E-commerce | Ignixales",
    seoDescription: "Promotional flyer and poster design for online stores: sale announcements, discount promotions, product launches and gift guides.",
    faqs: std("flyer design", "flyer design"),
  },
  {
    slug: "email-copywriting", index: "03", title: "Email Copywriting", art: "email",
    short: "Persuasive promotional email copy, from subject lines to full sequences.",
    long: "We write clear, persuasive promotional email copy that fits your brand voice and your offer: subject lines, preview text and body copy for individual emails or short sequences.",
    deliverables: ["Promotional email campaigns", "Black Friday announcements", "Christmas sale announcements", "New Year promotions", "Product launch emails", "Subject lines and preview text", "Promotional email sequences"],
    industries: ["Fashion", "Beauty", "Electronics", "Lifestyle", "Home", "Accessories"],
    benefits: ["Copy matched to your brand voice", "Subject lines and preview text included", "Aligned with your campaign visuals"],
    related: ["starter-creative", "growth-campaign", "pro-campaign", "complete-campaign"],
    note: "Email copywriting means written copy. It is separate from email graphic design.",
    seoTitle: "E-commerce Email Copywriting | Ignixales",
    seoDescription: "Promotional email copywriting for e-commerce: Black Friday, Christmas and New Year emails, subject lines, preview text and sequences.",
    faqs: [
      { q: "Is email design included?", a: "Email copywriting is written copy only. Graphics for your campaign can be ordered through our banner, flyer and social media design services." },
      ...std("email copy", "email copywriting"),
    ],
  },
  {
    slug: "social-media-design", index: "04", title: "Social Media Design", art: "social",
    short: "Campaign creatives for Instagram, Facebook and promotional advertising.",
    long: "We design social creatives that carry your campaign across the feeds where your customers already are, with consistent visuals from post to story to carousel.",
    deliverables: ["Instagram posts", "Instagram stories", "Facebook posts", "Carousel graphics", "Product promotions", "Seasonal announcements", "Promotional advertising creatives"],
    industries: ["Fashion", "Beauty", "Electronics", "Lifestyle", "Accessories"],
    benefits: ["Platform-appropriate sizes", "Consistent campaign look", "Ready to schedule or use in ads"],
    related: ["starter-creative", "growth-campaign", "pro-campaign", "complete-campaign"],
    seoTitle: "Social Media Design for E-commerce | Ignixales",
    seoDescription: "Social media design for e-commerce: Instagram posts and stories, Facebook posts, carousels and promotional advertising creatives.",
    faqs: std("social media design", "social media design"),
  },
];

export const defaultCampaigns: Campaign[] = [
  {
    slug: "black-friday", name: "Black Friday", theme: "bf", art: "black-friday", cta: "Explore Black Friday Campaigns",
    headline: "Make your Black Friday campaign unmissable.",
    blurb: "Make your biggest sales event impossible to ignore with bold Black Friday campaign creatives.",
    intro: "Black Friday is crowded. We prepare the promotional creative that helps your offer stand out: coordinated banners, discount graphics, flyers, social creatives and email copy that all tell the same story.",
    styleNote: "Black, white, electric lime and high-contrast promotional graphics.",
    showcase: [
      { title: "Homepage banners", text: "Hero and announcement banners with a clear offer and countdown-free urgency." },
      { title: "Discount graphics", text: "Bold percentage, bundle and doorbuster graphics for product and collection pages." },
      { title: "Promotional flyers", text: "Flyers and posters that summarise your offers at a glance." },
      { title: "Social media creatives", text: "Posts, stories and carousels for the build-up, the event and the last chance." },
      { title: "Email campaign copy", text: "Subject lines, preview text and promotional email copy for each send." },
      { title: "Cyber Monday variations", text: "Follow-on variations so your campaign continues past Friday." },
    ],
    recommendedPackage: "pro-campaign",
    seoTitle: "Black Friday Campaign Design for E-commerce | Ignixales",
    seoDescription: "Black Friday campaign design for online stores: homepage banners, discount graphics, promotional flyers, social creatives and email copy, including Cyber Monday variations.",
    faqs: [
      { q: "When should I start my Black Friday project?", a: "As early as you can. Send your brief once your offers are decided so there is time for revisions before your campaign goes live." },
      { q: "Can you include Cyber Monday?", a: "Yes. Cyber Monday variations can be included in the brief or added as a campaign variation." },
      { q: "Which package suits Black Friday?", a: "Most stores preparing a full event choose Pro or Complete, but Starter and Growth work well for a focused promotion." },
    ],
  },
  {
    slug: "christmas", name: "Christmas Sales", theme: "xmas", art: "christmas", cta: "Explore Christmas Campaigns",
    headline: "Make this Christmas your most memorable campaign yet.",
    blurb: "Create memorable festive campaigns that make your products stand out during the busiest shopping season.",
    intro: "Christmas shoppers respond to warmth, gifting and clarity. We create elegant festive campaigns with premium reds, gold and green, and product compositions that feel gift-worthy.",
    styleNote: "Premium festive colours, rich reds, gold, green and elegant product compositions.",
    showcase: [
      { title: "Gift promotions", text: "Campaign creative that frames your products as the perfect gift." },
      { title: "Holiday sales", text: "Banners and flyers for seasonal offers and limited collections." },
      { title: "Product bundles", text: "Visuals that make bundles and gift sets easy to understand." },
      { title: "Christmas offers", text: "Clear offer graphics, from free shipping messages to discount codes." },
      { title: "Gift guides", text: "Editorial gift guide layouts to help shoppers browse by recipient or budget." },
      { title: "Festive social media campaigns", text: "A consistent festive look across posts, stories and carousels." },
      { title: "Christmas promotional email copy", text: "Warm, persuasive copy for gifting announcements and last-order reminders." },
    ],
    recommendedPackage: "pro-campaign",
    seoTitle: "Christmas Campaign Design for E-commerce | Ignixales",
    seoDescription: "Christmas campaign design for online stores: gift promotions, holiday sale banners, gift guides, festive social media and promotional email copy.",
    faqs: [
      { q: "Can you design gift guides?", a: "Yes. Gift guides are part of our flyer and promotional design service." },
      { q: "Do you write the Christmas emails too?", a: "Yes. Promotional email copy is available in every package." },
      { q: "Can the campaign match my existing brand colours?", a: "Absolutely. We use festive styling while keeping your brand recognisable." },
    ],
  },
  {
    slug: "new-year", name: "New Year Sales", theme: "ny", art: "new-year", cta: "Explore New Year Campaigns",
    headline: "Start the new year with a campaign that sells.",
    blurb: "Start the year strong with promotional creatives that help your brand introduce new offers and attract customers.",
    intro: "A new year is a natural moment for a fresh start, new collections and new offers. We create fresh, energetic and optimistic campaign creative to help you open the year with momentum.",
    styleNote: "Fresh, energetic, celebratory, modern and optimistic.",
    showcase: [
      { title: "New Year sale banners", text: "Optimistic, high-clarity banners for your January sale." },
      { title: "Fresh-start promotions", text: "Creative that speaks to new routines, goals and wardrobes." },
      { title: "Product offers", text: "Offer graphics for single products and bundles." },
      { title: "New collection promotions", text: "Launch creative for your first collection of the year." },
      { title: "Social media creatives", text: "Posts, stories and carousels for your new year campaign." },
      { title: "Promotional email copy", text: "Copy that welcomes shoppers into the new year with your offer." },
    ],
    recommendedPackage: "growth-campaign",
    seoTitle: "New Year Sale Campaign Design | Ignixales",
    seoDescription: "New Year campaign design for e-commerce brands: sale banners, fresh-start promotions, new collection creatives, social media and email copy.",
    faqs: [
      { q: "Can you help launch a new collection?", a: "Yes. New collection promotions are a common New Year brief." },
      { q: "Which package should I choose?", a: "Growth works well for a focused sale; choose Pro or Complete for a larger launch." },
      { q: "Can I reuse my Christmas assets?", a: "Upload them with your brief and we can build a consistent follow-on campaign." },
    ],
  },
];

/** Built-in CONCEPT samples shown only while no real projects have been published. Always labelled as concepts. */
export const conceptProjects: Project[] = [
  ["black-friday-lime-drop", "Lime Drop: Black Friday Hero", "Concept brand", "electronics", "black-friday", "banner-design", "homepage", "A high-contrast Black Friday homepage banner concept for a gadget store.", ["Homepage banner", "Mobile banner", "Cyber Monday variation"]],
  ["festive-gift-guide", "The Gold Edit: Christmas Gift Guide", "Concept brand", "accessories", "christmas", "flyer-design", "christmas", "An elegant festive gift guide concept in deep red and gold.", ["Gift guide flyer", "Collection banner"]],
  ["fresh-start-launch", "Fresh Start: New Year Launch", "Concept brand", "lifestyle", "new-year", "social-media-design", "new-year", "An optimistic New Year collection launch social concept.", ["Instagram post", "Story", "Carousel"]],
  ["runway-sale-social", "Runway Sale Social Set", "Concept brand", "fashion", "black-friday", "social-media-design", "fashion", "A fashion sale social media graphic concept.", ["Instagram post", "Story"]],
  ["glow-skincare-flyer", "Glow Ritual Skincare Flyer", "Concept brand", "beauty", "christmas", "flyer-design", "skincare", "A skincare promotional flyer concept.", ["Promotional flyer", "Social teaser"]],
  ["inbox-countdown-email", "Inbox Takeover: Promotional Email", "Concept brand", "lifestyle", "black-friday", "email-copywriting", "email", "A promotional email copy concept with subject line and preview text.", ["Email copy", "Subject lines", "Preview text"]],
  ["volt-gadget-banner", "Volt Gadget Sale Banner", "Concept brand", "electronics", "new-year", "banner-design", "electronics", "A gadget sale banner concept for desktop and mobile.", ["Homepage banner", "Product banner"]],
  ["hearth-home-bundle", "Hearth: Home Bundle Promotion", "Concept brand", "home", "christmas", "banner-design", "home", "A home and lifestyle bundle promotion concept.", ["Bundle banner", "Flyer"]],
].map(([slug, title, client, industry, camp, svc, art, desc, dels], i) => ({
  id: `concept-${slug}`, slug: slug as string, title: title as string, client_name: client as string,
  industry: industry as string, campaign_type: camp as string, service_category: svc as string,
  description: desc as string,
  objective: "Show how a coordinated seasonal promotion can look. This is a concept created by Ignixales and not completed client work.",
  creative_direction: "Bold hierarchy, a single clear offer and a consistent visual language across every asset in the campaign.",
  deliverables: dels as string[], cover_url: null, video_url: null, project_date: null,
  featured: i < 6, is_concept: true, related_services: [svc as string], related_package: "pro-campaign", tags: [], images: [],
  art: art as Project["art"],
}));

/** Describes service MODELS in general, not any named provider. Values: true | string (nuance) */
export const comparisonRows = [
  { label: "E-commerce campaign focus", cols: ["Varies", "Varies", true] },
  { label: "Coordinated creative direction", cols: ["Varies", "You coordinate it", true] },
  { label: "Banner design", cols: ["Varies", true, true] },
  { label: "Promotional flyer design", cols: ["Varies", true, true] },
  { label: "Social media design", cols: ["Varies", true, true] },
  { label: "Email copywriting", cols: ["Varies", "Separate hire", true] },
  { label: "Seasonal campaign packages", cols: ["Varies", "Varies", true] },
  { label: "Centralised project briefing", cols: ["Single contact", "One brief per creative", true] },
  { label: "Clear package pricing", cols: ["Varies", "Varies", true] },
] as const;

export const industries = ["Fashion", "Beauty", "Electronics", "Lifestyle", "Home", "Accessories"];

/** Add real team profiles in Admin → Content → Team. The About page hides the section while empty. */
export const defaultTeam: TeamMember[] = [];
