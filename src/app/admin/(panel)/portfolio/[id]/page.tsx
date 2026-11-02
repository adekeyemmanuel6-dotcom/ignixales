import { notFound } from "next/navigation";
import { serviceClient, publicUrl } from "@/lib/supabase";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { deleteImage, deleteProject, moveImage, setCoverFromImage } from "../../../actions";

export default async function EditProject({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { id } = await params; const { saved } = await searchParams; const sb = serviceClient(); if (!sb) notFound();
  const { data: p } = await sb.from("projects").select("*, project_images(*)").eq("id", id).single();
  if (!p) notFound();
  const imgs = [...(p.project_images as any[])].sort((a, b) => a.sort_order - b.sort_order);
  return (<><h1 className="h-display text-4xl">{p.title}</h1>
    {saved && <p role="status" className="mt-3 text-lime">Saved.</p>}
    <p className="mt-1 text-sm text-mute">Public URL: /work/{p.slug}</p>
    <div className="mt-6 max-w-4xl"><ProjectForm p={{ ...p, project_date: p.project_date ?? "" }} /></div>
    <section className="mt-12 max-w-4xl"><h2 className="h-display text-3xl">Gallery ({imgs.length})</h2><p className="text-sm text-mute">Use ↑ / ↓ to reorder. The order here is the order on the public page.</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">{imgs.map((i, n) => (
        <li key={i.id} className="card overflow-hidden">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={publicUrl(i.path)!} alt="" className="aspect-video w-full object-cover" />
          <div className="flex flex-wrap items-center gap-2 p-3 text-xs"><span className="rounded bg-white/10 px-2 py-1">{i.kind}</span>
            <form action={moveImage.bind(null, i.id, id, -1)}><button disabled={n === 0} className="btn btn-ghost !min-h-[32px] !px-3 !py-0 disabled:opacity-30" aria-label="Move up">↑</button></form>
            <form action={moveImage.bind(null, i.id, id, 1)}><button disabled={n === imgs.length - 1} className="btn btn-ghost !min-h-[32px] !px-3 !py-0 disabled:opacity-30" aria-label="Move down">↓</button></form>
            <form action={setCoverFromImage.bind(null, i.id, id)}><button className="underline">Use as cover</button></form>
            <form action={deleteImage.bind(null, i.id, id)}><button className="text-red-400 underline">Delete</button></form></div></li>))}</ul></section>
    <form action={deleteProject.bind(null, id)} className="mt-12 border-t border-white/10 pt-6"><button className="btn btn-ghost !border-red-400/50 !text-red-400">Delete project permanently</button><p className="mt-2 text-xs text-mute">Removes the project and all of its images.</p></form></>);
}
