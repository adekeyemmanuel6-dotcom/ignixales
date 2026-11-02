import { notFound } from "next/navigation";
import { CONTENT_KEYS, getContent, type ContentKey } from "@/lib/content";
import { JsonEditor, ListEditor, SettingsEditor, type FDef } from "@/components/admin/ListEditor";

const T = (key: string, label: string, type: FDef["type"] = "text", extra: Partial<FDef> = {}): FDef => ({ key, label, type, ...extra });
const defs: Record<string, { title: string; titleKey: string; fields: FDef[]; blank: object; note?: string }> = {
  packages: { title: "Packages & prices", titleKey: "name", note: "Prices are proposed starting values. Review before publishing. Disabled packages are hidden from the site and the order form.", blank: { slug: "new-package", name: "New package", bestFor: "", price: 0, currency: "USD", deliverables: [], revisions: "1 revision round", delivery: "", recommended: false, enabled: true, qty: { banner: 0, flyer: 0, social: 0, email: 0 } },
    fields: [T("name", "Package name"), T("slug", "URL slug", "text", { hint: "keep stable once live" }), T("price", "Price", "number"), T("currency", "Currency"), T("bestFor", "Ideal customer", "textarea"), T("deliverables", "Deliverables (one per line)", "lines"), T("revisions", "Revision allowance"), T("delivery", "Delivery time"), T("qty.banner", "Banners", "number"), T("qty.flyer", "Flyers", "number"), T("qty.social", "Social designs", "number"), T("qty.email", "Email copies", "number"), T("recommended", "Recommended", "checkbox"), T("enabled", "Enabled", "checkbox")] },
  addons: { title: "Add-ons", titleKey: "name", blank: { id: "new-addon", name: "New add-on", price: 0, unit: null, enabled: true },
    fields: [T("name", "Name"), T("id", "ID", "text", { hint: "keep stable" }), T("price", "Price", "number"), T("note", "Note"), T("unit", "Counts as extra…", "select", { options: ["banner", "flyer", "social", "email"] }), T("enabled", "Enabled", "checkbox")] },
  stats: { title: "Studio statistics", titleKey: "label", note: "Only enter verified numbers. Empty value = [NUMBER] placeholder is shown (no count-up).", blank: { id: "new", value: "", suffix: "+", label: "New statistic" }, fields: [T("label", "Label"), T("value", "Value (digits only)"), T("suffix", "Suffix (+ or %)"), T("id", "ID")] },
  faqs: { title: "FAQ", titleKey: "q", blank: { q: "", a: "" }, fields: [T("q", "Question", "text", { wide: true }), T("a", "Answer", "textarea")] },
  team: { title: "Team profiles", titleKey: "name", note: "Use genuine team photos (image URLs).", blank: { name: "", role: "", bio: "", photo: "" }, fields: [T("name", "Name"), T("role", "Role"), T("photo", "Photo URL"), T("bio", "Bio", "textarea")] },
};

export default async function ContentKeyPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!(CONTENT_KEYS as string[]).includes(key)) notFound();
  const data = await getContent<any>(key as ContentKey);
  const d = defs[key];
  return (<><h1 className="h-display text-4xl">{d?.title ?? (key === "settings" ? "Contact & social links" : `${key[0].toUpperCase()}${key.slice(1)} (advanced JSON)`)}</h1>
    {d?.note && <p className="mt-2 text-sm text-mute">{d.note}</p>}
    {!d && key !== "settings" && <p className="mt-2 text-sm text-mute">Advanced: edit the JSON carefully; invalid structure is rejected. Use “Reset to defaults” to restore the built-in content.</p>}
    <div className="mt-6 max-w-4xl">{key === "settings" ? <SettingsEditor initial={data} /> : d ? <ListEditor contentKey={key} initial={data} fields={d.fields} blank={d.blank} titleKey={d.titleKey} resetable /> : <JsonEditor contentKey={key} initial={data} />}</div></>);
}
