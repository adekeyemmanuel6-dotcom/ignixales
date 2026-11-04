import { notFound } from "next/navigation";
import { serviceClient, publicUrl } from "@/lib/supabase";
import { ServiceUploader } from "@/components/admin/ServiceUploader";
import { deleteServiceImage, moveServiceImage, updateServiceImage } from "../../../actions";

const names: Record<string, string> = { "flyer-design": "Flyer & Promotional Design", "banner-design": "Banner Design", "social-media-design": "Social Media Design", "email-copywriting": "Email Copywriting" };
export default async function GalleryAdmin({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; if (!names[slug]) notFound();
  const { data } = (await serviceClient()?.from("service_images").select("*").eq("service_slug", slug).order("sort_order").order("created_at")) ?? { data: [] };
  return (<><h1 className="h-display text-4xl">{names[slug]} gallery</h1>
    <p className="mt-1 text-sm text-mute">Public page: /services/{slug}. Use ↑ ↓ to set the order. Untick “Visible” to hide an image without deleting it.</p>
    <div className="mt-6 max-w-3xl"><ServiceUploader slug={slug} /></div>
    <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{data?.map((im: any, n: number) => (
      <li key={im.id} className="card overflow-hidden">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={publicUrl(im.path)!} alt="" className="aspect-[4/3] w-full bg-surface object-contain" />
        <form action={updateServiceImage.bind(null, im.id, slug)} className="space-y-2 p-3 text-sm">
          <input name="brand" defaultValue={im.brand ?? ""} placeholder="Brand name" className="field !py-2 !text-sm" />
          <input name="title" defaultValue={im.title ?? ""} placeholder="Caption (optional)" className="field !py-2 !text-sm" />
          <div className="flex items-center justify-between"><label className="flex items-center gap-2 text-xs"><input type="checkbox" name="published" defaultChecked={im.published} className="h-4 w-4 accent-[#D8FF00]" />Visible</label><button className="btn btn-ghost !min-h-[34px] !px-4 !py-1 !text-xs">Save</button></div>
        </form>
        <div className="flex gap-2 border-t border-white/10 p-3 text-xs">
          <form action={moveServiceImage.bind(null, im.id, slug, -1)}><button disabled={n === 0} aria-label="Move up" className="btn btn-ghost !min-h-[32px] !px-3 !py-0 disabled:opacity-30">↑</button></form>
          <form action={moveServiceImage.bind(null, im.id, slug, 1)}><button disabled={n === (data?.length ?? 0) - 1} aria-label="Move down" className="btn btn-ghost !min-h-[32px] !px-3 !py-0 disabled:opacity-30">↓</button></form>
          <form action={deleteServiceImage.bind(null, im.id, slug)} className="ml-auto"><button className="text-red-400 underline">Delete</button></form></div></li>))}</ul>
    {!data?.length && <p className="mt-6 text-mute">No images yet. Upload your first batch above.</p>}</>);
}
