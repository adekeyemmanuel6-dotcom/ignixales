import Link from "next/link";
import { serviceClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const STATUSES = ["New", "Reviewing", "Awaiting Information", "In Progress", "Awaiting Approval", "Completed"];
export default async function Submissions({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams; const sb = serviceClient();
  let q = sb?.from("submissions").select("id, reference, status, package_slug, customer, campaign, estimated_price, created_at").order("created_at", { ascending: false }).limit(200);
  if (q && status) q = q.eq("status", status);
  const rows = (await q)?.data ?? [];
  return (<><h1 className="h-display text-4xl">Project submissions</h1>
    <div className="mt-5 flex flex-wrap gap-2 text-sm"><Link href="/admin/submissions" className={cn("rounded-full border px-3 py-1", !status ? "border-lime text-lime" : "border-white/20")}>All</Link>{STATUSES.map((s) => <Link key={s} href={`/admin/submissions?status=${encodeURIComponent(s)}`} className={cn("rounded-full border px-3 py-1", status === s ? "border-lime text-lime" : "border-white/20")}>{s}</Link>)}</div>
    <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="text-xs uppercase text-mute"><tr><th className="p-3">Reference</th><th className="p-3">Customer</th><th className="p-3">Package</th><th className="p-3">Campaign</th><th className="p-3">Est.</th><th className="p-3">Status</th><th className="p-3">Received</th></tr></thead>
      <tbody>{rows.map((r: any) => <tr key={r.id} className="border-t border-white/10 hover:bg-white/5"><td className="p-3"><Link className="font-semibold text-lime" href={`/admin/submissions/${r.id}`}>{r.reference}</Link></td><td className="p-3">{r.customer.businessName}<br /><span className="text-xs text-mute">{r.customer.email}</span></td><td className="p-3">{r.package_slug}</td><td className="p-3">{r.campaign.name}</td><td className="p-3">{r.estimated_price ? `$${r.estimated_price}` : "Quote"}</td><td className="p-3">{r.status}</td><td className="p-3 text-mute">{new Date(r.created_at).toLocaleDateString()}</td></tr>)}</tbody></table>
      {!rows.length && <p className="p-6 text-mute">No submissions yet.</p>}</div></>);
}
