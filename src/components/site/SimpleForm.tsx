"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Script from "next/script";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export type Field = { name: string; label: string; type?: "text" | "email" | "url" | "textarea" | "select"; required?: boolean; options?: string[]; full?: boolean; placeholder?: string };

export function Turnstile() {
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!key) return null;
  return <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" /><div className="cf-turnstile mt-2" data-sitekey={key} data-theme="dark" /></>;
}
export const turnstileToken = (form: HTMLFormElement | null) => (form?.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value || "";

export function FieldInput({ f, error, light }: { f: Field; error?: string; light?: boolean }) {
  const cls = cn("field", light && "field-light", error && "!border-red-400");
  const id = `f-${f.name}`;
  return (
    <div className={cn(f.full || f.type === "textarea" ? "sm:col-span-2" : "")}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{f.label}{f.required && <span className="text-lime"> *</span>}</label>
      {f.type === "textarea" ? <textarea id={id} name={f.name} rows={5} required={f.required} placeholder={f.placeholder} className={cls} aria-invalid={!!error} />
        : f.type === "select" ? <select id={id} name={f.name} required={f.required} className={cls} defaultValue=""><option value="" disabled>Select…</option>{f.options!.map((o) => <option key={o}>{o}</option>)}</select>
        : <input id={id} name={f.name} type={f.type || "text"} required={f.required} placeholder={f.placeholder} className={cls} aria-invalid={!!error} autoComplete={f.type === "email" ? "email" : undefined} />}
      {error && <p role="alert" className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}

export function SimpleForm({ endpoint, fields, submit, event, successTitle, successText }: { endpoint: string; fields: Field[]; submit: string; event: string; successTitle: string; successText: string }) {
  const ref = useRef<HTMLFormElement>(null);
  const started = useRef(Date.now());
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState(""); const [fields_, setFields] = useState<Record<string, string>>({});
  useEffect(() => { started.current = Date.now(); }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(""); setFields({}); setStatus("sending");
    const fd = new FormData(e.currentTarget);
    const body: Record<string, unknown> = Object.fromEntries(fd.entries());
    body.started_at = started.current; body.turnstile = turnstileToken(ref.current);
    try {
      const r = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        setStatus("idle"); setError(j.error || "Something went wrong. Please try again.");
        if (j.fields) setFields(Object.fromEntries(Object.entries(j.fields as Record<string, string[]>).map(([k, v]) => [k, v[0]])));
        return;
      }
      track(event); setStatus("done");
    } catch { setStatus("idle"); setError("Network error. Please check your connection and try again."); }
  }

  if (status === "done") return (
    <div role="status" className="card border-lime/40 p-8 text-center"><p className="h-display text-4xl text-lime">{successTitle}</p><p className="mx-auto mt-3 max-w-md text-mute">{successText}</p></div>
  );
  return (
    <form ref={ref} onSubmit={onSubmit} noValidate={false} className="grid gap-5 sm:grid-cols-2">
      <div className="absolute -left-[9999px]" aria-hidden><label>Leave empty<input name="website_hp" tabIndex={-1} autoComplete="off" /></label></div>
      {fields.map((f) => <FieldInput key={f.name} f={f} error={fields_[f.name]} />)}
      <div className="sm:col-span-2"><Turnstile />
        {error && <p role="alert" className="mb-3 rounded-lg border border-red-400/40 bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}
        <button disabled={status === "sending"} className="btn btn-lime w-full sm:w-auto">{status === "sending" ? "Sending…" : submit}</button></div>
    </form>
  );
}
