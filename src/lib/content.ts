import { cache } from "react";
import { serviceClient, publicUrl } from "./supabase";
import {
  defaultPackages, defaultAddons, defaultStats, defaultFaqs, defaultSettings,
  defaultServices, defaultCampaigns, defaultTeam, conceptProjects,
} from "./defaults";
import type { Package, Addon, Stat, Faq, Settings, Service, Campaign, Project, Testimonial, TeamMember } from "./types";

/** key -> default. Every key is editable in /admin/content/[key]. */
const DEFAULTS = {
  packages: defaultPackages, addons: defaultAddons, stats: defaultStats, faqs: defaultFaqs,
  settings: defaultSettings, services: defaultServices, campaigns: defaultCampaigns, team: defaultTeam,
} as const;
export type ContentKey = keyof typeof DEFAULTS;
export const CONTENT_KEYS = Object.keys(DEFAULTS) as ContentKey[];

async function load<T>(key: ContentKey): Promise<T> {
  const sb = serviceClient();
  if (sb) {
    try {
      const { data } = await sb.from("site_content").select("value").eq("key", key).maybeSingle();
      if (data?.value != null) {
        const v = data.value;
        // merge object defaults so new fields never break an older saved row
        if (!Array.isArray(v) && typeof v === "object") return { ...(DEFAULTS[key] as object), ...v } as T;
        return v as T;
      }
    } catch { /* fall through to defaults */ }
  }
  return DEFAULTS[key] as unknown as T;
}

export const getContent = cache(load) as <T>(key: ContentKey) => Promise<T>;
export const getPackages = cache(async () => (await load<Package[]>("packages")).filter((p) => p.enabled));
export const getAllPackages = () => load<Package[]>("packages");
export const getAddons = cache(async () => (await load<Addon[]>("addons")).filter((a) => a.enabled));
export const getStats = () => load<Stat[]>("stats");
export const getFaqs = () => load<Faq[]>("faqs");
export const getSettings = cache(() => load<Settings>("settings"));
export const getServices = cache(() => load<Service[]>("services"));
export const getCampaigns = cache(() => load<Campaign[]>("campaigns"));
export const getTeam = cache(() => load<TeamMember[]>("team"));

/* ---------- Portfolio ---------- */
type Row = Record<string, any>;
function mapProject(r: Row): Project {
  const images = ((r.project_images || []) as Row[])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => ({ id: i.id, url: publicUrl(i.path)!, kind: i.kind, caption: i.caption }));
  return {
    id: r.id, slug: r.slug, title: r.title, client_name: r.client_name, industry: r.industry,
    campaign_type: r.campaign_type, service_category: r.service_category, description: r.description,
    objective: r.objective, creative_direction: r.creative_direction, deliverables: r.deliverables || [],
    cover_url: publicUrl(r.cover_image_path), video_url: r.video_url, project_date: r.project_date,
    featured: r.featured, is_concept: r.is_concept, related_services: r.related_services || [],
    related_package: r.related_package, tags: r.tags || [], images,
  };
}

/** Published projects from the database. If none exist yet, clearly-labelled concept samples are returned. */
export const getProjects = cache(async (): Promise<{ projects: Project[]; fromDb: boolean }> => {
  const sb = serviceClient();
  if (sb) {
    try {
      const { data, error } = await sb.from("projects").select("*, project_images(*)").eq("published", true)
        .order("featured", { ascending: false }).order("sort_order").order("project_date", { ascending: false, nullsFirst: false });
      if (!error && data && data.length) return { projects: data.map(mapProject), fromDb: true };
    } catch { /* ignore */ }
  }
  return { projects: conceptProjects, fromDb: false };
});

export async function getProject(slug: string) {
  const { projects } = await getProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const sb = serviceClient();
  if (!sb) return [];
  try {
    const { data } = await sb.from("testimonials").select("*").eq("published", true).order("sort_order");
    return (data || []).map((t: Row) => ({ id: t.id, name: t.name, company: t.company, role: t.role, quote: t.quote, photo_url: publicUrl(t.photo_path) }));
  } catch { return []; }
});
