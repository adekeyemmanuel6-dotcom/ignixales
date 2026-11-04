import Link from "next/link";
import { serviceClient } from "@/lib/supabase";
const services = [["flyer-design", "Flyer & Promotional Design"], ["banner-design", "Banner Design"], ["social-media-design", "Social Media Design"], ["email-copywriting", "Email Copywriting (samples)"]];
export default async function Galleries() {
  const sb = serviceClient();
  const counts = await Promise.all(services.map(async ([s]) => (sb ? (await sb.from("service_images").select("id", { count: "exact", head: true }).eq("service_slug", s)).count ?? 0 : 0)));
  return (<><h1 className="h-display text-4xl">Service galleries</h1><p className="mt-2 text-sm text-mute">Upload your work straight to each service. Images appear on that service’s page in a gallery.</p>
    <ul className="mt-6 grid gap-4 sm:grid-cols-2">{services.map(([s, t], i) => <li key={s}><Link href={`/admin/gallery/${s}`} className="card block p-5 hover:border-lime/50"><b>{t}</b><span className="mt-2 block font-display text-4xl text-lime">{counts[i]} <span className="text-sm text-mute">images</span></span></Link></li>)}</ul></>);
}
