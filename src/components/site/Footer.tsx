import Link from "next/link";
import { Logo } from "./Logo";
import { getSettings } from "@/lib/content";

const col = (title: string, items: [string, string][]) => (
  <div>
    <h3 className="label mb-4 !text-white/50">{title}</h3>
    <ul className="space-y-2.5 text-sm">{items.map(([l, h]) => <li key={h}><Link href={h} className="text-white/80 transition hover:text-lime">{l}</Link></li>)}</ul>
  </div>
);

export async function Footer() {
  const s = await getSettings();
  const socials = s.socials.filter((x) => x.url);
  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm text-mute">Ignite Your Sales. Your e-commerce campaign creative partner: banners, flyers, social media creatives and promotional email copy for Black Friday, Christmas and New Year.</p>
          {socials.length > 0 && <ul className="mt-5 flex flex-wrap gap-2">{socials.map((x) => <li key={x.label}><a href={x.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:border-lime hover:text-lime">{x.label}</a></li>)}</ul>}
        </div>
        {col("Explore", [["Home", "/"], ["Services", "/services"], ["Our Work", "/work"], ["Pricing", "/pricing"], ["About Us", "/about"], ["Contact", "/contact"]])}
        {col("Services", [["Banner Design", "/services/banner-design"], ["Flyer & Promotional Design", "/services/flyer-design"], ["Email Copywriting", "/services/email-copywriting"], ["Social Media Design", "/services/social-media-design"]])}
        {col("Seasonal campaigns", [["Black Friday", "/campaigns/black-friday"], ["Christmas", "/campaigns/christmas"], ["New Year", "/campaigns/new-year"], ["Start a project", "/start-project"]])}
        <div>
          <h3 className="label mb-4 !text-white/50">Contact</h3>
          <ul className="space-y-2.5 text-sm text-white/80">
            <li><a href={`mailto:${s.email}`} className="hover:text-lime">{s.email}</a></li>
            {s.location && <li>{s.location}</li>}
            <li className="text-mute">{s.responseTime}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-4 py-6 text-xs text-mute md:flex-row md:items-center md:justify-between">
          <Link href="/website-development" className="font-medium uppercase tracking-wider text-white/60 hover:text-lime">Need a website? Request website design &amp; development.</Link>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/terms" className="hover:text-lime">Terms &amp; Conditions</Link>
            <Link href="/privacy" className="hover:text-lime">Privacy Policy</Link>
            <span>© {new Date().getFullYear()} Ignixales. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
