import { notFound } from "next/navigation";
import { serviceClient } from "@/lib/supabase";
import { updateSubmission } from "../../../actions";
import { FileDownload } from "@/components/admin/FileDownload";

const STATUSES = ["New", "Reviewing", "Awaiting Information", "In Progress", "Awaiting Approval", "Completed"];
const Dl = ({ t, o }: { t: string; o: Record<string, any> }) => <section className="card p-5"><h2 className="label mb-3">{t}</h2><dl className="space-y-2 text-sm">{Object.entries(o).filter(([, v]) => v !== "" && v != null).map(([k, v]) => <div key={k} className="flex justify-between gap-4 border-b border-white/10 pb-2"><dt className="text-mute">{k}</dt><dd className="max-w-[60%] break-words text-right">{typeof v === "object" ? JSON.stringify(v) : String(v)}</dd></div>)}</dl></section>;

export default async function SubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const sb = serviceClient(); if (!sb) notFound();
  const { data: s } = await sb.from("submissions").select("*").eq("id", id).single();
  if (!s) notFound();
  const { data: files } = await sb.from("submission_files").select("id, original_name, size, category, mime").eq("submission_id", id).order("created_at");
  return (<>
    <p className="label">{s.reference}</p><h1 className="h-display text-4xl">{s.customer.businessName}</h1>
    <p className="mt-1 text-mute">{s.package_slug} · {s.estimated_price ? `$${s.estimated_price} estimated` : "Custom quote"} · {new Date(s.created_at).toLocaleString()}</p>
    <form action={updateSubmission.bind(null, id)} className="card mt-6 grid gap-4 p-5 sm:grid-cols-[220px_1fr_auto] sm:items-end">
      <label><span className="mb-1 block text-xs text-mute">Status</span><select name="status" defaultValue={s.status} className="field !py-2.5">{STATUSES.map((x) => <option key={x}>{x}</option>)}</select></label>
      <label><span className="mb-1 block text-xs text-mute">Internal notes (never shown to the customer)</span><textarea name="notes" rows={3} defaultValue={s.internal_notes ?? ""} className="field !py-2.5" /></label>
      <button className="btn btn-lime">Save</button>
    </form>
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      <Dl t="Customer" o={s.customer} /><Dl t="Campaign" o={s.campaign} /><Dl t="Services requested" o={s.services} />
      <Dl t="Add-ons" o={Object.fromEntries((s.addons as any[]).map((a) => [a.id, `× ${a.qty}`]))} /><Dl t="Additional info" o={s.extra} />
      <section className="card p-5"><h2 className="label mb-3">Uploaded files ({files?.length ?? 0})</h2>
        <ul className="space-y-2 text-sm">{files?.map((f) => <li key={f.id} className="flex items-center justify-between gap-3 border-b border-white/10 pb-2"><span className="min-w-0 truncate">{f.original_name}<span className="ml-2 text-xs text-mute">{f.category} · {(f.size / 1048576).toFixed(1)} MB</span></span><FileDownload id={f.id} /></li>)}</ul>
        {!files?.length && <p className="text-sm text-mute">No files uploaded.</p>}</section>
    </div></>);
}
