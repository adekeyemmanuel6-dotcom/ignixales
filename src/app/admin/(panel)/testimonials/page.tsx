import { serviceClient } from "@/lib/supabase";
import { deleteTestimonial, saveTestimonial } from "../../actions";

const Form = ({ t }: { t?: any }) => (
  <form action={saveTestimonial} className="card grid gap-3 p-4 sm:grid-cols-2">
    <input type="hidden" name="id" value={t?.id ?? ""} />
    <input name="name" required placeholder="Customer name *" defaultValue={t?.name} className="field !py-2.5" /><input name="company" placeholder="Company" defaultValue={t?.company ?? ""} className="field !py-2.5" />
    <input name="role" placeholder="Role" defaultValue={t?.role ?? ""} className="field !py-2.5" /><input name="photo_path" placeholder="Photo URL (optional)" defaultValue={t?.photo_path ?? ""} className="field !py-2.5" />
    <textarea name="quote" required rows={3} placeholder="Testimonial * (genuine client words only)" defaultValue={t?.quote} className="field sm:col-span-2" />
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={t?.published} className="h-5 w-5 accent-[#D8FF00]" />Published</label>
    <div className="flex gap-2 sm:justify-end"><button className="btn btn-lime !min-h-[40px]">{t ? "Save" : "Add testimonial"}</button></div>
  </form>);
export default async function Testimonials() {
  const { data } = (await serviceClient()?.from("testimonials").select("*").order("sort_order").order("created_at", { ascending: false })) ?? { data: [] };
  return (<><h1 className="h-display text-4xl">Testimonials</h1><p className="mt-2 text-sm text-mute">Only publish genuine client testimonials. The homepage section stays hidden until at least one is published.</p>
    <div className="mt-6 max-w-3xl space-y-4"><h2 className="label">Add new</h2><Form />
      {data?.map((t: any) => <div key={t.id} className="space-y-2"><Form t={t} /><form action={deleteTestimonial.bind(null, t.id)}><button className="text-xs text-red-400 underline">Delete “{t.name}”</button></form></div>)}</div></>);
}
