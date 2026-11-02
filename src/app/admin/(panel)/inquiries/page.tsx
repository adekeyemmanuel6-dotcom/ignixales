import { serviceClient } from "@/lib/supabase";
import { updateInquiry } from "../../actions";

const STATUSES = ["New", "Reviewing", "Awaiting Information", "In Progress", "Awaiting Approval", "Completed"];
async function List({ table, title }: { table: "contact_messages" | "website_requests"; title: string }) {
  const { data } = (await serviceClient()?.from(table).select("*").order("created_at", { ascending: false }).limit(100)) ?? { data: [] };
  return (<section className="mt-8"><h2 className="h-display text-3xl">{title}</h2>
    <div className="mt-4 space-y-3">{data?.map((r: any) => (
      <details key={r.id} className="card"><summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 p-4 text-sm"><span><b>{r.data.name}</b> · {r.data.email}{r.data.subject && ` · ${r.data.subject}`}{r.data.business && ` · ${r.data.business}`}</span><span className="text-mute">{r.status} · {new Date(r.created_at).toLocaleDateString()}</span></summary>
        <div className="space-y-3 border-t border-white/10 p-4 text-sm"><dl>{Object.entries(r.data).map(([k, v]) => v ? <div key={k} className="flex gap-3 py-1"><dt className="w-32 flex-none text-mute">{k}</dt><dd className="whitespace-pre-wrap break-words">{String(v)}</dd></div> : null)}</dl>
          <form action={updateInquiry.bind(null, table, r.id)} className="flex items-center gap-2"><select name="status" defaultValue={r.status} className="field !w-auto !py-2">{STATUSES.map((x) => <option key={x}>{x}</option>)}</select><button className="btn btn-ghost !min-h-[40px]">Update</button></form></div></details>))}
      {!data?.length && <p className="text-mute">Nothing here yet.</p>}</div></section>);
}
export default function Inquiries() { return (<><h1 className="h-display text-4xl">Enquiries</h1><List table="contact_messages" title="Contact messages" /><List table="website_requests" title="Website development requests" /></>); }
