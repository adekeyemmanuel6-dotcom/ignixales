"use client";
import { useState } from "react";
import { saveProject, signPortfolioUpload } from "@/app/admin/actions";
import { putSigned } from "@/lib/upload-client";
import { publicUrl } from "@/lib/supabase-public";

type P = { id?: string; slug?: string; title?: string; client_name?: string; industry?: string; campaign_type?: string; service_category?: string; description?: string; objective?: string; creative_direction?: string; deliverables?: string[]; video_url?: string; project_date?: string; featured?: boolean; is_concept?: boolean; published?: boolean; related_services?: string[]; related_package?: string; tags?: string[]; cover_image_path?: string };
type Up = { path: string; kind: string; name: string; progress: number; error?: string };

const INDUSTRIES = ["fashion", "beauty", "electronics", "lifestyle", "home", "accessories"];
const CAMPAIGNS = ["black-friday", "christmas", "new-year", "other"];
const SERVICES = ["banner-design", "flyer-design", "email-copywriting", "social-media-design"];

async function uploadMany(files: FileList, kind: string, set: (fn: (u: Up[]) => Up[]) => void) {
  for (const file of Array.from(files)) {
    const key = `${Date.now()}-${file.name}`;
    const ext = file.name.split(".").pop() || "";
    set((u) => [...u, { path: key, kind, name: file.name, progress: 1 }]);
    const sg = await signPortfolioUpload(ext);
    if ("error" in sg && sg.error) { set((u) => u.map((x) => x.path === key ? { ...x, error: sg.error, progress: 0 } : x)); continue; }
    try {
      await putSigned(sg.signedUrl!, file, (p) => set((u) => u.map((x) => x.path === key ? { ...x, progress: p } : x)));
      set((u) => u.map((x) => x.path === key ? { ...x, path: sg.path!, progress: 100 } : x));
    } catch (e) { set((u) => u.map((x) => x.path === key ? { ...x, error: (e as Error).message, progress: 0 } : x)); }
  }
}

export function ProjectForm({ p }: { p: P }) {
  const [cover, setCover] = useState<Up[]>([]);
  const [imgs, setImgs] = useState<Up[]>([]);
  const [kind, setKind] = useState("gallery");
  const busy = [...cover, ...imgs].some((u) => u.progress > 0 && u.progress < 100);
  const coverDone = cover.filter((c) => c.progress === 100)[0];
  const added = imgs.filter((i) => i.progress === 100).map((i) => ({ path: i.path, kind: i.kind }));
  const t = (k: keyof P, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => <label className="block"><span className="mb-1 block text-xs font-medium text-mute">{label}</span><input name={k} defaultValue={(p[k] as string) ?? ""} className="field !py-2.5" {...props} /></label>;
  const sel = (k: keyof P, label: string, opts: string[]) => <label className="block"><span className="mb-1 block text-xs font-medium text-mute">{label}</span><select name={k} defaultValue={(p[k] as string) ?? ""} className="field !py-2.5"><option value="">None</option>{opts.map((o) => <option key={o}>{o}</option>)}</select></label>;
  const area = (k: keyof P, label: string, rows = 3, v?: string) => <label className="block sm:col-span-2"><span className="mb-1 block text-xs font-medium text-mute">{label}</span><textarea name={k} rows={rows} defaultValue={v ?? ((p[k] as string) ?? "")} className="field !py-2.5" /></label>;
  return (
    <form action={saveProject} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={p.id ?? ""} />
      <input type="hidden" name="cover_path" value={coverDone?.path ?? ""} />
      <input type="hidden" name="new_images" value={JSON.stringify(added)} />
      {t("title", "Project title *", { required: true })}{t("slug", "URL slug (auto if empty)", { placeholder: "e.g. winter-sale-banner" })}
      {t("client_name", "Client or brand name")}{sel("industry", "Industry", INDUSTRIES)}
      {sel("campaign_type", "Campaign type", CAMPAIGNS)}{sel("service_category", "Service category", SERVICES)}
      {area("description", "Project description")}{area("objective", "Campaign objective")}{area("creative_direction", "Creative direction")}
      {area("deliverables", "Deliverables (one per line)", 4, (p.deliverables ?? []).join("\n"))}
      {t("project_date", "Project date", { type: "date" })}{t("video_url", "Video preview URL (.mp4/.webm or link)")}
      {t("related_services", "Related services (comma separated slugs)", { defaultValue: (p.related_services ?? []).join(", ") })}{t("related_package", "Related package slug", { placeholder: "pro-campaign" })}
      {t("tags", "Tags (comma separated)", { defaultValue: (p.tags ?? []).join(", ") })}
      <fieldset className="flex flex-wrap items-center gap-6 sm:col-span-2">
        {([["published", "Published", p.published], ["featured", "Featured", p.featured], ["is_concept", "Concept project (not completed client work)", p.is_concept ?? true]] as const).map(([n, l, d]) => <label key={n} className="flex items-center gap-2 text-sm"><input type="checkbox" name={n} defaultChecked={!!d} className="h-5 w-5 accent-[#D8FF00]" />{l}</label>)}
      </fieldset>

      <div className="card p-4 sm:col-span-2">
        <h3 className="label">Cover image</h3>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          {(coverDone?.path || p.cover_image_path) && /* eslint-disable-next-line @next/next/no-img-element */ <img src={publicUrl(coverDone?.path || p.cover_image_path)!} alt="Cover" className="h-24 w-36 rounded-lg object-cover" />}
          <input type="file" accept="image/*" onChange={(e) => e.target.files && uploadMany(e.target.files, "cover", setCover)} className="text-sm" />
          {cover.map((c) => <span key={c.path} className="text-xs text-mute">{c.error ? <span className="text-red-400">{c.error}</span> : `${c.name} ${c.progress}%`}</span>)}
        </div>
      </div>
      <div className="card p-4 sm:col-span-2">
        <h3 className="label">Add gallery images / mockups</h3>
        <p className="mt-1 text-xs text-mute">Select multiple files. Images are added when you save. You can reorder or delete them afterwards.</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <select value={kind} onChange={(e) => setKind(e.target.value)} className="field !w-auto !py-2 text-sm"><option value="gallery">Gallery</option><option value="mockup">Mockup</option><option value="before">Before</option><option value="after">After</option></select>
          <input type="file" multiple accept="image/*" onChange={(e) => e.target.files && uploadMany(e.target.files, kind, setImgs)} className="text-sm" />
        </div>
        <ul className="mt-3 space-y-1 text-xs">{imgs.map((c) => <li key={c.path} className={c.error ? "text-red-400" : "text-mute"}>{c.name} ({c.kind}) {c.error || `${c.progress}%`}</li>)}</ul>
      </div>
      <div className="sm:col-span-2"><button disabled={busy} className="btn btn-lime">{busy ? "Uploading…" : p.id ? "Save project" : "Create project"}</button></div>
    </form>
  );
}
