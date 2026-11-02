import Link from "next/link";
import { serviceClient } from "@/lib/supabase";
import { togglePublish } from "../../actions";

export default async function PortfolioAdmin() {
  const { data } = (await serviceClient()?.from("projects").select("id, title, slug, industry, campaign_type, published, featured, is_concept").order("created_at", { ascending: false })) ?? { data: [] };
  return (<><div className="flex flex-wrap items-center justify-between gap-3"><h1 className="h-display text-4xl">Portfolio</h1><Link href="/admin/portfolio/new" className="btn btn-lime">+ New project</Link></div>
    {!data?.length && <p className="mt-6 rounded-lg border border-white/10 p-4 text-sm text-mute">No projects yet. The public site is showing clearly-labelled built-in concept samples until you publish your first project.</p>}
    <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">{data?.map((p) => (
      <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><Link href={`/admin/portfolio/${p.id}`} className="font-semibold hover:text-lime">{p.title}</Link><p className="text-xs text-mute">{[p.industry, p.campaign_type, p.is_concept ? "concept" : "client work", p.featured ? "featured" : ""].filter(Boolean).join(" · ")}</p></div>
        <form action={togglePublish.bind(null, p.id, !p.published)} className="flex items-center gap-2"><span className={p.published ? "text-lime" : "text-mute"}>{p.published ? "Published" : "Draft"}</span><button className="btn btn-ghost !min-h-[36px] !px-3 !py-1 !text-xs">{p.published ? "Unpublish" : "Publish"}</button></form></li>))}</ul></>);
}
