"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addServiceImages, signPortfolioUpload } from "@/app/admin/actions";
import { putSigned } from "@/lib/upload-client";

type Row = { key: string; name: string; progress: number; error?: string; path?: string };

export function ServiceUploader({ slug }: { slug: string }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [brand, setBrand] = useState("");
  const [busy, setBusy] = useState(false);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    const list = Array.from(files);
    setRows(list.map((f, i) => ({ key: `${i}-${f.name}`, name: f.name, progress: 0 })));
    const done: { path: string; brand: string }[] = [];
    // upload sequentially to keep memory/network predictable on large batches
    for (let i = 0; i < list.length; i++) {
      const f = list[i], key = `${i}-${f.name}`;
      const upd = (p: Partial<Row>) => setRows((r) => r.map((x) => (x.key === key ? { ...x, ...p } : x)));
      const sg = await signPortfolioUpload(f.name.split(".").pop() || "");
      if ("error" in sg && sg.error) { upd({ error: sg.error }); continue; }
      try { await putSigned(sg.signedUrl!, f, (p) => upd({ progress: p })); upd({ progress: 100, path: sg.path }); done.push({ path: sg.path!, brand }); }
      catch (e) { upd({ error: (e as Error).message }); }
    }
    if (done.length) await addServiceImages(slug, done);
    setBusy(false); router.refresh();
  }
  return (
    <div className="card p-5">
      <h2 className="label">Upload images</h2>
      <p className="mt-1 text-xs text-mute">Select as many files as you like (JPG, PNG, WEBP). Optionally enter the brand name first; it is applied to this batch. You can edit each one afterwards.</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Brand name for this batch (optional)" className="field !w-72 !py-2.5" />
        <input type="file" multiple accept="image/*" disabled={busy} onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} className="text-sm" />
      </div>
      <ul className="mt-3 space-y-1 text-xs">{rows.map((r) => <li key={r.key} className={r.error ? "text-red-400" : r.progress === 100 ? "text-lime" : "text-mute"}>{r.name}: {r.error || (r.progress === 100 ? "uploaded" : `${r.progress}%`)}</li>)}</ul>
    </div>
  );
}
