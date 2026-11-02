import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAdmin } from "@/lib/supabase-server";
import { hasServiceRole } from "@/lib/supabase";
import { logout } from "../actions";
import { Logo } from "@/components/site/Logo";

export const metadata: Metadata = { title: "Ignixales Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const nav = [["/admin", "Dashboard"], ["/admin/submissions", "Submissions"], ["/admin/inquiries", "Enquiries"], ["/admin/portfolio", "Portfolio"], ["/admin/content/packages", "Packages & prices"], ["/admin/content/addons", "Add-ons"], ["/admin/content", "Website content"], ["/admin/testimonials", "Testimonials"]];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdmin();
  if (!user) redirect("/admin/login");
  return (
    <div className="min-h-screen bg-ink lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-white/10 bg-surface p-4 lg:min-h-screen lg:border-b-0 lg:border-r">
        <Logo /><nav aria-label="Admin" className="mt-4 flex gap-1 overflow-x-auto lg:flex-col">{nav.map(([h, l]) => <Link key={h} href={h} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-lime">{l}</Link>)}</nav>
        <div className="mt-6 hidden text-xs text-mute lg:block"><p className="truncate">{user.email}</p><form action={logout}><button className="mt-2 underline">Sign out</button></form><Link href="/" className="mt-2 block underline" target="_blank">View site ↗</Link></div>
      </aside>
      <div className="min-w-0 p-5 sm:p-8">
        {!hasServiceRole() && <p className="mb-6 rounded-lg border border-red-400/40 bg-red-400/10 p-3 text-sm text-red-300">SUPABASE_SERVICE_ROLE_KEY is not set. Admin data cannot be loaded or saved.</p>}
        {children}
      </div>
    </div>
  );
}
