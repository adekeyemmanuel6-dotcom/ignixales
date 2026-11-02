import Link from "next/link";
import { serviceClient } from "@/lib/supabase";

export default async function Dashboard() {
  const sb = serviceClient();
  const count = async (t: string, f?: (q: any) => any) => { if (!sb) return 0; let q = sb.from(t).select("id", { count: "exact", head: true }); if (f) q = f(q); return (await q).count ?? 0; };
  const [newSubs, allSubs, inProg, projects, published, enquiries] = await Promise.all([
    count("submissions", (q) => q.eq("status", "New")), count("submissions"), count("submissions", (q) => q.eq("status", "In Progress")),
    count("projects"), count("projects", (q) => q.eq("published", true)), count("contact_messages", (q) => q.eq("status", "New")),
  ]);
  const cards = [["New submissions", newSubs, "/admin/submissions"], ["In progress", inProg, "/admin/submissions"], ["All submissions", allSubs, "/admin/submissions"], ["Published projects", `${published}/${projects}`, "/admin/portfolio"], ["New contact messages", enquiries, "/admin/inquiries"]] as const;
  return (<><h1 className="h-display text-4xl">Dashboard</h1>
    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([l, v, h]) => <Link key={l} href={h} className="card p-5 transition hover:border-lime/50"><p className="text-sm text-mute">{l}</p><p className="h-display mt-1 text-5xl text-lime">{v}</p></Link>)}</div>
    <div className="mt-8 grid gap-3 text-sm sm:grid-cols-2"><Link className="card p-4 hover:border-lime/50" href="/admin/portfolio/new">+ Add a portfolio project</Link><Link className="card p-4 hover:border-lime/50" href="/admin/content/stats">Update studio statistics (placeholders until verified)</Link><Link className="card p-4 hover:border-lime/50" href="/admin/content/packages">Review package prices before launch</Link><Link className="card p-4 hover:border-lime/50" href="/admin/testimonials">Add genuine testimonials</Link></div></>);
}
