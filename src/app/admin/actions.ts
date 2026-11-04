"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { authClient, requireAdmin, adminEmails } from "@/lib/supabase-server";
import { serviceClient, BUCKET_ASSETS, BUCKET_PORTFOLIO } from "@/lib/supabase";
import { slugify } from "@/lib/utils";
import { CONTENT_KEYS } from "@/lib/content";

const db = () => { const sb = serviceClient(); if (!sb) throw new Error("Supabase service role is not configured"); return sb; };
const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const lines = (v: string) => v.split("\n").map((x) => x.trim()).filter(Boolean);
const csv = (v: string) => v.split(",").map((x) => x.trim()).filter(Boolean);

/* ---------- auth ---------- */
export async function login(_: unknown, f: FormData) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { error: "Supabase is not configured. See README." };
  const email = str(f, "email").toLowerCase();
  if (!adminEmails().includes(email)) return { error: "Invalid credentials." };
  const sb = await authClient();
  const { error } = await sb.auth.signInWithPassword({ email, password: String(f.get("password") ?? "") });
  if (error) return { error: "Invalid credentials." };
  redirect("/admin");
}
export async function logout() { const sb = await authClient(); await sb.auth.signOut(); redirect("/admin/login"); }

/* ---------- submissions & inquiries ---------- */
const STATUSES = ["New", "Reviewing", "Awaiting Information", "In Progress", "Awaiting Approval", "Completed"];
export async function updateSubmission(id: string, f: FormData) {
  await requireAdmin();
  const status = str(f, "status");
  if (!STATUSES.includes(status)) throw new Error("Bad status");
  await db().from("submissions").update({ status, internal_notes: str(f, "notes"), updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin/submissions"); revalidatePath(`/admin/submissions/${id}`);
}
export async function updateInquiry(table: "contact_messages" | "website_requests", id: string, f: FormData) {
  await requireAdmin();
  if (!["contact_messages", "website_requests"].includes(table)) throw new Error("Bad table");
  const status = str(f, "status");
  if (!STATUSES.includes(status)) throw new Error("Bad status");
  await db().from(table).update({ status }).eq("id", id);
  revalidatePath("/admin/inquiries");
}
/** Short-lived signed download link for a private customer file. */
export async function fileLink(fileId: string) {
  await requireAdmin();
  const sb = db();
  const { data: file } = await sb.from("submission_files").select("path, original_name").eq("id", fileId).single();
  if (!file) return null;
  const { data } = await sb.storage.from(BUCKET_ASSETS).createSignedUrl(file.path, 120, { download: file.original_name });
  return data?.signedUrl ?? null;
}

/* ---------- portfolio ---------- */
export async function signPortfolioUpload(ext: string) {
  await requireAdmin();
  const e = ext.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!["png", "jpg", "jpeg", "webp", "gif", "mp4", "webm", "avif"].includes(e)) return { error: "Unsupported file type" };
  const path = `projects/${randomUUID()}.${e}`;
  const { data, error } = await db().storage.from(BUCKET_PORTFOLIO).createSignedUploadUrl(path);
  if (error || !data) return { error: "Could not start upload" };
  return { path, signedUrl: data.signedUrl };
}

export async function saveProject(f: FormData) {
  await requireAdmin();
  const sb = db();
  const id = str(f, "id");
  const title = str(f, "title");
  if (!title) throw new Error("Title is required");
  const row = {
    title, client_name: str(f, "client_name") || null, industry: str(f, "industry") || null,
    campaign_type: str(f, "campaign_type") || null, service_category: str(f, "service_category") || null,
    description: str(f, "description") || null, objective: str(f, "objective") || null, creative_direction: str(f, "creative_direction") || null,
    deliverables: lines(str(f, "deliverables")), video_url: str(f, "video_url") || null, project_date: str(f, "project_date") || null,
    featured: f.get("featured") === "on", is_concept: f.get("is_concept") === "on", published: f.get("published") === "on",
    related_services: csv(str(f, "related_services")), related_package: str(f, "related_package") || null, tags: csv(str(f, "tags")),
    updated_at: new Date().toISOString(),
    ...(str(f, "cover_path") ? { cover_image_path: str(f, "cover_path") } : {}),
  };
  let pid = id;
  if (id) {
    const { error } = await sb.from("projects").update({ ...row, ...(str(f, "slug") ? { slug: slugify(str(f, "slug")) } : {}) }).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    let slug = slugify(str(f, "slug") || title);
    const { data: ex } = await sb.from("projects").select("id").eq("slug", slug).maybeSingle();
    if (ex) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    const { data, error } = await sb.from("projects").insert({ ...row, slug }).select("id").single();
    if (error || !data) throw new Error(error?.message || "Could not create project");
    pid = data.id;
  }
  const added = JSON.parse(str(f, "new_images") || "[]") as { path: string; kind: string }[];
  if (added.length) {
    const { data: last } = await sb.from("project_images").select("sort_order").eq("project_id", pid).order("sort_order", { ascending: false }).limit(1);
    let n = (last?.[0]?.sort_order ?? -1) + 1;
    await sb.from("project_images").insert(added.map((a) => ({ project_id: pid, path: a.path, kind: ["gallery", "mockup", "before", "after"].includes(a.kind) ? a.kind : "gallery", sort_order: n++ })));
  }
  revalidatePath("/work"); revalidatePath("/"); revalidatePath("/admin/portfolio");
  redirect(`/admin/portfolio/${pid}?saved=1`);
}

export async function togglePublish(id: string, published: boolean) {
  await requireAdmin(); await db().from("projects").update({ published }).eq("id", id);
  revalidatePath("/work"); revalidatePath("/"); revalidatePath("/admin/portfolio");
}
export async function deleteProject(id: string) {
  await requireAdmin(); const sb = db();
  const { data: imgs } = await sb.from("project_images").select("path").eq("project_id", id);
  const { data: p } = await sb.from("projects").select("cover_image_path").eq("id", id).single();
  const paths = [...(imgs?.map((i) => i.path) ?? []), ...(p?.cover_image_path ? [p.cover_image_path] : [])].filter((x) => !/^https?:/.test(x));
  if (paths.length) await sb.storage.from(BUCKET_PORTFOLIO).remove(paths);
  await sb.from("projects").delete().eq("id", id);
  revalidatePath("/work"); revalidatePath("/"); redirect("/admin/portfolio");
}
export async function deleteImage(imageId: string, projectId: string) {
  await requireAdmin(); const sb = db();
  const { data } = await sb.from("project_images").select("path").eq("id", imageId).single();
  if (data) await sb.storage.from(BUCKET_PORTFOLIO).remove([data.path]);
  await sb.from("project_images").delete().eq("id", imageId);
  revalidatePath(`/admin/portfolio/${projectId}`); revalidatePath("/work");
}
export async function moveImage(imageId: string, projectId: string, dir: -1 | 1) {
  await requireAdmin(); const sb = db();
  const { data } = await sb.from("project_images").select("id, sort_order").eq("project_id", projectId).order("sort_order").order("created_at");
  if (!data) return;
  const i = data.findIndex((x) => x.id === imageId), j = i + dir;
  if (i < 0 || j < 0 || j >= data.length) return;
  const order = data.map((x) => x.id); [order[i], order[j]] = [order[j], order[i]];
  await Promise.all(order.map((oid, n) => sb.from("project_images").update({ sort_order: n }).eq("id", oid)));
  revalidatePath(`/admin/portfolio/${projectId}`); revalidatePath("/work");
}
export async function setCoverFromImage(imageId: string, projectId: string) {
  await requireAdmin(); const sb = db();
  const { data } = await sb.from("project_images").select("path").eq("id", imageId).single();
  if (data) await sb.from("projects").update({ cover_image_path: data.path }).eq("id", projectId);
  revalidatePath(`/admin/portfolio/${projectId}`); revalidatePath("/work");
}

/* ---------- testimonials ---------- */
export async function saveTestimonial(f: FormData) {
  await requireAdmin(); const sb = db(); const id = str(f, "id");
  const row = { name: str(f, "name"), company: str(f, "company") || null, role: str(f, "role") || null, quote: str(f, "quote"), published: f.get("published") === "on", photo_path: str(f, "photo_path") || undefined };
  if (!row.name || !row.quote) throw new Error("Name and quote are required");
  if (id) await sb.from("testimonials").update(row).eq("id", id); else await sb.from("testimonials").insert(row);
  revalidatePath("/"); revalidatePath("/admin/testimonials");
}
export async function deleteTestimonial(id: string) { await requireAdmin(); await db().from("testimonials").delete().eq("id", id); revalidatePath("/"); revalidatePath("/admin/testimonials"); }

/* ---------- site content (packages, prices, stats, FAQ, settings, services, campaigns, team) ---------- */
export async function saveContent(key: string, json: string) {
  await requireAdmin();
  if (!(CONTENT_KEYS as string[]).includes(key)) return { error: "Unknown content key" };
  let value: unknown;
  try { value = JSON.parse(json); } catch { return { error: "Invalid JSON" }; }
  const arrays = ["packages", "addons", "stats", "faqs", "services", "campaigns", "team"];
  if (arrays.includes(key) !== Array.isArray(value)) return { error: arrays.includes(key) ? "Expected a list" : "Expected an object" };
  if (key === "packages") for (const p of value as any[]) { if (!p.slug || !p.name || typeof p.price !== "number" || p.price < 0) return { error: "Each package needs a slug, name and a numeric price" }; }
  if (key === "addons") for (const a of value as any[]) { if (!a.id || !a.name || typeof a.price !== "number") return { error: "Each add-on needs an id, name and numeric price" }; }
  const { error } = await db().from("site_content").upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}
export async function resetContent(key: string) {
  await requireAdmin(); await db().from("site_content").delete().eq("key", key); revalidatePath("/", "layout");
}

/* ---------- per-service galleries ---------- */
const SERVICE_SLUGS = ["banner-design", "flyer-design", "email-copywriting", "social-media-design"];
const refreshService = (slug: string) => { revalidatePath(`/services/${slug}`); revalidatePath("/services"); revalidatePath(`/admin/gallery/${slug}`); };
export async function addServiceImages(slug: string, items: { path: string; title?: string; brand?: string }[]) {
  await requireAdmin();
  if (!SERVICE_SLUGS.includes(slug)) throw new Error("Unknown service");
  const sb = db();
  const { data: last } = await sb.from("service_images").select("sort_order").eq("service_slug", slug).order("sort_order", { ascending: false }).limit(1);
  let n = (last?.[0]?.sort_order ?? -1) + 1;
  await sb.from("service_images").insert(items.map((i) => ({ service_slug: slug, path: i.path, title: i.title || null, brand: i.brand || null, sort_order: n++ })));
  refreshService(slug);
}
export async function updateServiceImage(id: string, slug: string, f: FormData) {
  await requireAdmin();
  await db().from("service_images").update({ title: str(f, "title") || null, brand: str(f, "brand") || null, published: f.get("published") === "on" }).eq("id", id);
  refreshService(slug);
}
export async function deleteServiceImage(id: string, slug: string) {
  await requireAdmin(); const sb = db();
  const { data } = await sb.from("service_images").select("path").eq("id", id).single();
  if (data) await sb.storage.from(BUCKET_PORTFOLIO).remove([data.path]);
  await sb.from("service_images").delete().eq("id", id);
  refreshService(slug);
}
export async function moveServiceImage(id: string, slug: string, dir: -1 | 1) {
  await requireAdmin(); const sb = db();
  const { data } = await sb.from("service_images").select("id").eq("service_slug", slug).order("sort_order").order("created_at");
  if (!data) return;
  const i = data.findIndex((x) => x.id === id), j = i + dir;
  if (i < 0 || j < 0 || j >= data.length) return;
  const order = data.map((x) => x.id); [order[i], order[j]] = [order[j], order[i]];
  await Promise.all(order.map((oid, n) => sb.from("service_images").update({ sort_order: n }).eq("id", oid)));
  refreshService(slug);
}
