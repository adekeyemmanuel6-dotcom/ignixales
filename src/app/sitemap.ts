import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/utils";
import { getProjects } from "@/lib/content";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = ["", "/services", "/services/banner-design", "/services/flyer-design", "/services/email-copywriting", "/services/social-media-design", "/campaigns", "/campaigns/black-friday", "/campaigns/christmas", "/campaigns/new-year", "/work", "/pricing", "/about", "/contact", "/start-project", "/website-development", "/terms", "/privacy"];
  const { projects } = await getProjects();
  return [...paths.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })), ...projects.map((p) => ({ url: `${SITE_URL}/work/${p.slug}`, priority: 0.5 }))];
}
