"use client";
import { useState, useTransition } from "react";
import { saveContent, resetContent } from "@/app/admin/actions";

export type FDef = { key: string; label: string; type: "text" | "number" | "textarea" | "checkbox" | "lines" | "select"; options?: string[]; wide?: boolean; hint?: string };
type Item = Record<string, any>;

const get = (o: Item, path: string) => path.split(".").reduce((a: any, k) => a?.[k], o);
const setp = (o: Item, path: string, v: unknown): Item => {
  const [h, ...r] = path.split(".");
  return { ...o, [h]: r.length ? setp(o[h] ?? {}, r.join("."), v) : v };
};

export function ListEditor({ contentKey, initial, fields, blank, titleKey, resetable }: { contentKey: string; initial: Item[]; fields: FDef[]; blank: Item; titleKey: string; resetable?: boolean }) {
  const [items, setItems] = useState<Item[]>(initial);
  const [msg, setMsg] = useState(""); const [pending, start] = useTransition();
  const upd = (i: number, path: string, v: unknown) => setItems((l) => l.map((x, n) => (n === i ? setp(x, path, v) : x)));
  const move = (i: number, d: number) => setItems((l) => { const a = [...l]; const j = i + d; if (j < 0 || j >= a.length) return a; [a[i], a[j]] = [a[j], a[i]]; return a; });
  const save = () => start(async () => { const r = await saveContent(contentKey, JSON.stringify(items)); setMsg(r.error ? `Error: ${r.error}` : "Saved. The website is updated."); });
  const cls = "field !py-2 !text-sm";
  return (
    <div className="space-y-4">
      {items.map((it, i) => (
        <details key={i} className="card" open={items.length <= 4}>
          <summary className="flex cursor-pointer items-center justify-between gap-3 p-4"><b>{String(get(it, titleKey) || `Item ${i + 1}`)}</b>
            <span className="flex gap-1"><button type="button" className="btn btn-ghost !min-h-[34px] !px-3 !py-1" onClick={(e) => { e.preventDefault(); move(i, -1); }} aria-label="Move up">↑</button><button type="button" className="btn btn-ghost !min-h-[34px] !px-3 !py-1" onClick={(e) => { e.preventDefault(); move(i, 1); }} aria-label="Move down">↓</button><button type="button" className="btn btn-ghost !min-h-[34px] !px-3 !py-1 hover:!border-red-400 hover:!text-red-400" onClick={(e) => { e.preventDefault(); if (confirm("Remove this item?")) setItems((l) => l.filter((_, n) => n !== i)); }}>Remove</button></span></summary>
          <div className="grid gap-3 border-t border-white/10 p-4 sm:grid-cols-2">
            {fields.map((f) => {
              const v = get(it, f.key);
              return (
                <label key={f.key} className={f.wide || f.type === "textarea" || f.type === "lines" ? "sm:col-span-2" : ""}>
                  <span className="mb-1 block text-xs font-medium text-mute">{f.label}{f.hint && <span className="ml-1 text-white/30">({f.hint})</span>}</span>
                  {f.type === "checkbox" ? <input type="checkbox" className="h-5 w-5 accent-[#D8FF00]" checked={!!v} onChange={(e) => upd(i, f.key, e.target.checked)} />
                    : f.type === "textarea" ? <textarea rows={3} className={cls} value={v ?? ""} onChange={(e) => upd(i, f.key, e.target.value)} />
                    : f.type === "lines" ? <textarea rows={5} className={cls} value={(v ?? []).join("\n")} onChange={(e) => upd(i, f.key, e.target.value.split("\n"))} onBlur={(e) => upd(i, f.key, e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))} />
                    : f.type === "select" ? <select className={cls} value={v ?? ""} onChange={(e) => upd(i, f.key, e.target.value || null)}><option value="">None</option>{f.options!.map((o) => <option key={o}>{o}</option>)}</select>
                    : <input className={cls} type={f.type} step={f.type === "number" ? "any" : undefined} value={v ?? ""} onChange={(e) => upd(i, f.key, f.type === "number" ? (e.target.value === "" ? 0 : Number(e.target.value)) : e.target.value)} />}
                </label>
              );
            })}
          </div>
        </details>
      ))}
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-ghost" onClick={() => setItems((l) => [...l, JSON.parse(JSON.stringify(blank))])}>+ Add item</button>
        <button type="button" disabled={pending} className="btn btn-lime" onClick={save}>{pending ? "Saving…" : "Save changes"}</button>
        {resetable && <button type="button" className="text-sm text-mute underline" onClick={() => confirm("Reset to built-in defaults?") && start(async () => { await resetContent(contentKey); location.reload(); })}>Reset to defaults</button>}
        {msg && <p role="status" className={msg.startsWith("Error") ? "text-red-400" : "text-lime"}>{msg}</p>}
      </div>
    </div>
  );
}

export function JsonEditor({ contentKey, initial }: { contentKey: string; initial: unknown }) {
  const [text, setText] = useState(JSON.stringify(initial, null, 2)); const [msg, setMsg] = useState(""); const [pending, start] = useTransition();
  return (
    <div>
      <textarea spellCheck={false} rows={26} className="field font-mono !text-xs" value={text} onChange={(e) => setText(e.target.value)} />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button disabled={pending} className="btn btn-lime" onClick={() => start(async () => { const r = await saveContent(contentKey, text); setMsg(r.error ? `Error: ${r.error}` : "Saved. The website is updated."); })}>{pending ? "Saving…" : "Save changes"}</button>
        <button className="text-sm text-mute underline" onClick={() => confirm("Reset to built-in defaults?") && start(async () => { await resetContent(contentKey); location.reload(); })}>Reset to defaults</button>
        {msg && <p role="status" className={msg.startsWith("Error") ? "text-red-400" : "text-lime"}>{msg}</p>}
      </div>
    </div>
  );
}

export function SettingsEditor({ initial }: { initial: { email: string; location: string; responseTime: string; socials: { label: string; url: string }[] } }) {
  const [s, setS] = useState(initial); const [msg, setMsg] = useState(""); const [pending, start] = useTransition();
  return (
    <div className="space-y-4">
      {(["email", "location", "responseTime"] as const).map((k) => <label key={k} className="block"><span className="mb-1 block text-xs font-medium text-mute">{k === "responseTime" ? "Expected response time" : k[0].toUpperCase() + k.slice(1)}</span><input className="field" value={s[k]} onChange={(e) => setS({ ...s, [k]: e.target.value })} /></label>)}
      <h3 className="label pt-2">Social links (blank URLs are hidden)</h3>
      {s.socials.map((x, i) => <div key={i} className="grid gap-2 sm:grid-cols-[160px_1fr_auto]"><input aria-label="Label" className="field" value={x.label} onChange={(e) => setS({ ...s, socials: s.socials.map((q, n) => n === i ? { ...q, label: e.target.value } : q) })} /><input aria-label="URL" className="field" placeholder="https://" value={x.url} onChange={(e) => setS({ ...s, socials: s.socials.map((q, n) => n === i ? { ...q, url: e.target.value } : q) })} /><button type="button" className="btn btn-ghost" onClick={() => setS({ ...s, socials: s.socials.filter((_, n) => n !== i) })}>Remove</button></div>)}
      <button type="button" className="btn btn-ghost" onClick={() => setS({ ...s, socials: [...s.socials, { label: "", url: "" }] })}>+ Add link</button>
      <div className="flex items-center gap-3"><button disabled={pending} className="btn btn-lime" onClick={() => start(async () => { const r = await saveContent("settings", JSON.stringify(s)); setMsg(r.error ? `Error: ${r.error}` : "Saved."); })}>Save changes</button>{msg && <p role="status" className="text-lime">{msg}</p>}</div>
    </div>
  );
}
