"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Addon, Package } from "@/lib/types";
import { estimate } from "@/lib/pricing";
import { cn, money } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { ALLOWED_EXT, FILE_CATEGORIES, MAX_FILES, MAX_FILE_MB } from "@/lib/validation";
import { Turnstile, turnstileToken } from "./SimpleForm";
import { putSigned } from "@/lib/upload-client";
import { Check } from "@/components/ui/Section";

type Qty = Package["qty"];
type UFile = { key: string; id?: string; name: string; size: number; category: string; progress: number; error?: string; preview?: string };
type State = {
  packageSlug: string;
  customer: { fullName: string; businessName: string; email: string; websiteUrl: string; country: string; industry: string; platform: string };
  campaign: { name: string; type: string; startDate: string; endDate: string; audience: string; objective: string; offer: string; direction: string };
  services: Qty; addons: Record<string, number>;
  extra: { description: string; links: string; instructions: string; contactMethod: string };
  terms: boolean;
};
const blank: State = {
  packageSlug: "",
  customer: { fullName: "", businessName: "", email: "", websiteUrl: "", country: "", industry: "", platform: "" },
  campaign: { name: "", type: "", startDate: "", endDate: "", audience: "", objective: "", offer: "", direction: "" },
  services: { banner: 0, flyer: 0, social: 0, email: 0 }, addons: {},
  extra: { description: "", links: "", instructions: "", contactMethod: "email" }, terms: false,
};
const STEPS = ["Package", "Business", "Campaign", "Services", "Assets", "Details", "Review"];
const INDUSTRIES = ["Fashion & clothing", "Beauty & skincare", "Electronics & gadgets", "Jewellery & accessories", "Home & lifestyle", "Other"];
const PLATFORMS = ["Shopify", "WooCommerce", "BigCommerce", "Wix", "Squarespace", "Magento", "Custom website", "Other"];
const CAMPAIGNS = ["Black Friday", "Christmas", "New Year", "Other promotional campaign"];
const COUNTRIES = ["United States", "United Kingdom", "Canada", "Australia", "Ireland", "Germany", "France", "Netherlands", "Spain", "Italy", "Sweden", "Denmark", "New Zealand", "United Arab Emirates", "South Africa", "Nigeria", "India", "Other"];
const CAT_LABEL: Record<string, string> = { logo: "Brand logo", guidelines: "Brand guidelines", "product-photos": "Product photos", mockups: "Product mockups", "existing-designs": "Existing promotional designs", references: "Inspiration & references", documents: "Campaign documents", other: "Other supporting files" };
const fmtSize = (b: number) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

function Lbl({ l, req, children, full, err }: { l: string; req?: boolean; children: React.ReactNode; full?: boolean; err?: string }) {
  return <label className={cn("block", full && "sm:col-span-2")}><span className="mb-1.5 block text-sm font-medium">{l}{req && <span className="text-lime"> *</span>}</span>{children}{err && <span role="alert" className="mt-1 block text-sm text-red-400">{err}</span>}</label>;
}

export function ProjectWizard({ packages, addons, initial, responseTime }: { packages: Package[]; addons: Addon[]; initial: { package?: string; campaign?: string; service?: string }; responseTime: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [s, setS] = useState<State>(blank);
  const [files, setFiles] = useState<UFile[]>([]);
  const [category, setCategory] = useState("logo");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [sending, setSending] = useState(false);
  const [drag, setDrag] = useState(false);
  const token = useRef(""); const startedAt = useRef(Date.now()); const tracked = useRef(false); const formRef = useRef<HTMLDivElement>(null);
  const hydrated = useRef(false);

  /* restore draft + prefill from URL */
  useEffect(() => {
    try {
      token.current = sessionStorage.getItem("igx-token") || crypto.randomUUID();
      sessionStorage.setItem("igx-token", token.current);
      const saved = sessionStorage.getItem("igx-draft");
      if (saved) { const d = JSON.parse(saved); setS({ ...blank, ...d.s }); setStep(d.step ?? 0); }
    } catch { token.current ||= crypto.randomUUID(); }
    setS((cur) => {
      const next = { ...cur };
      if (initial.package && (initial.package === "custom" || initial.package === "individual" || packages.some((p) => p.slug === initial.package))) { next.packageSlug = initial.package; }
      if (initial.campaign) next.campaign = { ...next.campaign, type: CAMPAIGNS.find((c) => c.toLowerCase().replace(/ /g, "-").startsWith(initial.campaign!.replace("christmas", "christmas"))) || next.campaign.type };
      if (initial.service && next.packageSlug === "individual") { const m: Record<string, keyof Qty> = { "banner-design": "banner", "flyer-design": "flyer", "email-copywriting": "email", "social-media-design": "social" }; const k = m[initial.service]; if (k && next.services[k] === 0) next.services = { ...next.services, [k]: 1 }; }
      return next;
    });
    hydrated.current = true;
  }, [initial, packages]);
  useEffect(() => { if (hydrated.current) try { sessionStorage.setItem("igx-draft", JSON.stringify({ s, step })); } catch {} }, [s, step]);

  const pkg = packages.find((p) => p.slug === s.packageSlug) ?? null;
  const individual = s.packageSlug === "individual", custom = s.packageSlug === "custom";
  /* package selection sets service quantities */
  useEffect(() => { if (pkg) setS((c) => ({ ...c, services: pkg.qty })); }, [pkg?.slug]); // eslint-disable-line
  const addonList = individual ? addons.filter((a) => !a.unit) : custom ? [] : addons;
  const addonArr = Object.entries(s.addons).filter(([, q]) => q > 0).map(([id, qty]) => ({ id, qty }));
  const est = useMemo(() => estimate(pkg, s.services, addonArr.filter((a) => addonList.some((x) => x.id === a.id)), addons, individual), [pkg, s.services, s.addons, individual]); // eslint-disable-line

  const started = () => { if (!tracked.current) { tracked.current = true; track("project_form_start"); } };
  const set = <K extends keyof State>(k: K, v: State[K]) => { started(); setS((c) => ({ ...c, [k]: v })); };
  const sub = <K extends "customer" | "campaign" | "extra">(k: K, f: string, v: string) => { started(); setS((c) => ({ ...c, [k]: { ...c[k], [f]: v } })); setErrors((e) => { const { [`${k}.${f}`]: _, ...r } = e; return r; }); };
  const input = <K extends "customer" | "campaign" | "extra">(k: K, f: string, p: React.InputHTMLAttributes<HTMLInputElement> = {}) => <input className={cn("field", errors[`${k}.${f}`] && "!border-red-400")} value={(s[k] as Record<string, string>)[f]} onChange={(e) => sub(k, f, e.target.value)} {...p} />;

  function validate(i: number) {
    const e: Record<string, string> = {}; const r = (k: string, v: string, m: string) => { if (!v.trim()) e[k] = m; };
    if (i === 0 && !s.packageSlug) e.package = "Please choose a package to continue";
    if (i === 1) { r("customer.fullName", s.customer.fullName, "Full name is required"); r("customer.businessName", s.customer.businessName, "Business name is required"); if (!/^\S+@\S+\.\S+$/.test(s.customer.email)) e["customer.email"] = "Enter a valid email address"; r("customer.country", s.customer.country, "Country is required"); r("customer.industry", s.customer.industry, "Industry is required"); }
    if (i === 2) { r("campaign.name", s.campaign.name, "Campaign name is required"); r("campaign.type", s.campaign.type, "Select a campaign type"); r("campaign.objective", s.campaign.objective, "Describe the main objective"); }
    if (i === 3 && (individual || custom) && Object.values(s.services).every((v) => !v)) e.services = "Select at least one service";
    if (i === 4 && files.some((f) => f.progress < 100 && !f.error)) e.files = "Please wait for uploads to finish";
    setErrors(e); return Object.keys(e).length === 0;
  }
  const go = (n: number) => { setStep(n); setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 30); };
  const next = () => { if (validate(step)) go(step + 1); };

  /* ---------- uploads ---------- */
  const upload = useCallback((file: File, cat: string) => {
    const key = crypto.randomUUID();
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const fail = (error: string) => setFiles((f) => [...f, { key, name: file.name, size: file.size, category: cat, progress: 0, error }]);
    if (!(ALLOWED_EXT as readonly string[]).includes(ext)) return fail(`Unsupported file type. Allowed: ${ALLOWED_EXT.join(", ").toUpperCase()}.`);
    if (file.size > MAX_FILE_MB * 1048576) return fail(`File is larger than ${MAX_FILE_MB} MB.`);
    if (file.size === 0) return fail("File is empty.");
    setFiles((f) => { if (f.filter((x) => !x.error).length >= MAX_FILES) { return [...f, { key, name: file.name, size: file.size, category: cat, progress: 0, error: `Maximum ${MAX_FILES} files per project.` }]; } return [...f, { key, name: file.name, size: file.size, category: cat, progress: 1, preview: file.type.startsWith("image/") && ext !== "svg" ? URL.createObjectURL(file) : undefined }]; });
    const setErr = (m: string) => setFiles((f) => f.map((q) => q.key === key ? { ...q, progress: 0, error: m } : q));
    const post = (body: object) => fetch("/api/upload", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).then(async (r) => ({ ok: r.ok, j: await r.json().catch(() => ({})) }));
    (async () => {
      try {
        const sg = await post({ op: "sign", draftToken: token.current, name: file.name, size: file.size, category: cat });
        if (!sg.ok) return setErr(sg.j.error || "Upload failed. Please try again.");
        await putSigned(sg.j.signedUrl, file, (pct) => setFiles((f) => f.map((q) => q.key === key ? { ...q, progress: Math.max(1, Math.min(99, pct)) } : q)));
        const done = await post({ op: "complete", draftToken: token.current, path: sg.j.path, name: file.name, category: cat });
        if (!done.ok) return setErr(done.j.error || "Upload failed. Please try again.");
        setFiles((f) => f.map((q) => q.key === key ? { ...q, id: done.j.id, progress: 100 } : q));
        track("file_upload", { category: cat });
      } catch (e) { setErr(e instanceof Error ? e.message : "Upload failed. Please try again."); }
    })();
  }, []);
  const addFiles = (list: FileList | null) => { if (!list) return; started(); Array.from(list).forEach((f) => upload(f, category)); };
  const removeFile = async (f: UFile) => {
    setFiles((l) => l.filter((x) => x.key !== f.key)); if (f.preview) URL.revokeObjectURL(f.preview);
    if (f.id) fetch("/api/upload", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ draftToken: token.current, id: f.id }) }).catch(() => {});
  };

  /* ---------- submit ---------- */
  async function submit() {
    setSubmitError("");
    if (!s.terms) { setErrors({ terms: "You must agree to the terms and privacy policy" }); return; }
    setSending(true);
    const body = { draftToken: token.current, packageSlug: s.packageSlug, services: s.services, addons: addonArr.filter((a) => addonList.some((x) => x.id === a.id)), customer: s.customer, campaign: s.campaign, extra: s.extra, terms: true, website_hp: (document.getElementById("hp") as HTMLInputElement | null)?.value || "", started_at: startedAt.current, turnstile: turnstileToken(formRef.current as unknown as HTMLFormElement) };
    try {
      const r = await fetch("/api/submit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        setSending(false); setSubmitError(j.error || "Something went wrong. Please try again.");
        if (j.fields) { const e: Record<string, string> = {}; for (const [k, v] of Object.entries(j.fields as Record<string, string[]>)) e[k] = v[0]; setErrors(e); }
        return;
      }
      track("project_form_submit", { package: s.packageSlug, value: est.total });
      try { sessionStorage.setItem("igx-confirmation", JSON.stringify({ ...j, files: files.filter((f) => f.id).length })); sessionStorage.removeItem("igx-draft"); sessionStorage.removeItem("igx-token"); } catch {}
      router.push(`/start-project/confirmation?ref=${encodeURIComponent(j.reference)}`);
    } catch { setSending(false); setSubmitError("Network error. Please check your connection and try again."); }
  }

  const stepper = (k: keyof Qty, label: string) => (
    <div key={k} className="flex items-center justify-between rounded-xl border border-white/10 bg-surface p-4">
      <span className="font-medium">{label}</span>
      {pkg ? <span className="font-display text-2xl text-lime">{s.services[k]}</span> : (
        <span className="flex items-center gap-3"><button type="button" aria-label={`Fewer ${label}`} onClick={() => set("services", { ...s.services, [k]: Math.max(0, s.services[k] - 1) })} className="h-10 w-10 rounded-full border border-white/20 text-xl">−</button><output className="w-6 text-center font-display text-2xl">{s.services[k]}</output><button type="button" aria-label={`More ${label}`} onClick={() => set("services", { ...s.services, [k]: Math.min(50, s.services[k] + 1) })} className="h-10 w-10 rounded-full border border-white/20 text-xl">+</button></span>)}
    </div>
  );
  const row = (k: string, v?: string) => v ? <div className="flex justify-between gap-4 border-b border-white/10 py-2 text-sm"><dt className="text-mute">{k}</dt><dd className="text-right font-medium">{v}</dd></div> : null;
  const pkgName = pkg?.name ?? (custom ? "Custom Package" : individual ? "Individual Service Request" : "—");
  const uploading = files.some((f) => f.progress > 0 && f.progress < 100 && !f.error);

  return (
    <div ref={formRef} className="scroll-mt-28">
      <ol className="mb-8 flex gap-1.5 overflow-x-auto" aria-label="Progress">
        {STEPS.map((t, i) => (
          <li key={t} className="min-w-[64px] flex-1">
            <button type="button" disabled={i > step} onClick={() => go(i)} aria-current={i === step ? "step" : undefined} className="w-full text-left">
              <span className={cn("block h-1.5 rounded-full transition", i <= step ? "bg-lime" : "bg-white/15")} />
              <span className={cn("mt-2 hidden text-xs font-medium uppercase tracking-wider sm:block", i === step ? "text-lime" : "text-mute")}>{i + 1}. {t}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="mb-6 text-sm text-lime sm:hidden">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
      <div className="absolute -left-[9999px]" aria-hidden><label>Leave empty<input id="hp" tabIndex={-1} autoComplete="off" /></label></div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          {step === 0 && (
            <fieldset>
              <legend className="h-display text-3xl">Select a package</legend>
              <div role="radiogroup" className="mt-6 grid gap-3 sm:grid-cols-2">
                {[...packages.map((p) => ({ slug: p.slug, name: p.name, desc: p.bestFor, price: money(p.price, p.currency), rec: p.recommended, list: p.deliverables.slice(0, 4) })),
                  { slug: "custom", name: "Custom Package", desc: "Tell us what you need and we’ll prepare a custom quote.", price: "Quote", rec: false, list: [] as string[] },
                  { slug: "individual", name: "Individual Service Request", desc: "Order only the services you need (e.g. banners only).", price: "From add-on rates", rec: false, list: [] as string[] }].map((p) => (
                  <label key={p.slug} className={cn("relative cursor-pointer rounded-card border p-5 transition", s.packageSlug === p.slug ? "border-lime bg-lime/5" : "border-white/10 bg-card hover:border-white/30")}>
                    <input type="radio" name="pkg" className="sr-only" checked={s.packageSlug === p.slug} onChange={() => { set("packageSlug", p.slug); track("package_click", { package: p.slug }); setErrors({}); }} />
                    {p.rec && <span className="absolute -top-2.5 right-4 rounded-full bg-lime px-2.5 py-0.5 text-[10px] font-bold uppercase text-black">Recommended</span>}
                    <span className="flex items-start justify-between gap-3"><span className="font-display text-2xl uppercase">{p.name}</span><span className="font-display text-2xl text-lime">{p.price}</span></span>
                    <span className="mt-1 block text-sm text-mute">{p.desc}</span>
                    {p.list.length > 0 && <ul className="mt-3 space-y-1 text-xs text-white/70">{p.list.map((x) => <li key={x} className="flex gap-2"><Check />{x}</li>)}</ul>}
                  </label>))}
              </div>
              {errors.package && <p role="alert" className="mt-3 text-sm text-red-400">{errors.package}</p>}
            </fieldset>
          )}

          {step === 1 && (
            <div><h2 className="h-display text-3xl">Business information</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Lbl l="Full name" req err={errors["customer.fullName"]}>{input("customer", "fullName", { autoComplete: "name" })}</Lbl>
                <Lbl l="Business name" req err={errors["customer.businessName"]}>{input("customer", "businessName", { autoComplete: "organization" })}</Lbl>
                <Lbl l="Email address" req err={errors["customer.email"]}>{input("customer", "email", { type: "email", autoComplete: "email" })}</Lbl>
                <Lbl l="Website URL" err={errors["customer.websiteUrl"]}>{input("customer", "websiteUrl", { type: "url", placeholder: "https://" })}</Lbl>
                <Lbl l="Country" req err={errors["customer.country"]}>{input("customer", "country", { list: "countries", autoComplete: "country-name" })}<datalist id="countries">{COUNTRIES.map((c) => <option key={c} value={c} />)}</datalist></Lbl>
                <Lbl l="Industry" req err={errors["customer.industry"]}><select className={cn("field", errors["customer.industry"] && "!border-red-400")} value={s.customer.industry} onChange={(e) => sub("customer", "industry", e.target.value)}><option value="">Select…</option>{INDUSTRIES.map((x) => <option key={x}>{x}</option>)}</select></Lbl>
                <Lbl l="E-commerce platform" full><select className="field" value={s.customer.platform} onChange={(e) => sub("customer", "platform", e.target.value)}><option value="">Select…</option>{PLATFORMS.map((x) => <option key={x}>{x}</option>)}</select></Lbl>
              </div></div>
          )}

          {step === 2 && (
            <div><h2 className="h-display text-3xl">Campaign information</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Lbl l="Campaign name" req err={errors["campaign.name"]}>{input("campaign", "name", { placeholder: "e.g. Winter Warm-Up Sale" })}</Lbl>
                <Lbl l="Campaign type" req err={errors["campaign.type"]}><select className={cn("field", errors["campaign.type"] && "!border-red-400")} value={s.campaign.type} onChange={(e) => sub("campaign", "type", e.target.value)}><option value="">Select…</option>{CAMPAIGNS.map((x) => <option key={x}>{x}</option>)}</select></Lbl>
                <Lbl l="Campaign start date">{input("campaign", "startDate", { type: "date" })}</Lbl>
                <Lbl l="Campaign end date">{input("campaign", "endDate", { type: "date" })}</Lbl>
                <Lbl l="Target audience" full>{input("campaign", "audience", { placeholder: "Who are you trying to reach?" })}</Lbl>
                <Lbl l="Main campaign objective" req full err={errors["campaign.objective"]}><textarea rows={3} className={cn("field", errors["campaign.objective"] && "!border-red-400")} value={s.campaign.objective} onChange={(e) => sub("campaign", "objective", e.target.value)} /></Lbl>
                <Lbl l="Promotional offer or discount" full>{input("campaign", "offer", { placeholder: "e.g. 30% off sitewide, free shipping over $50" })}</Lbl>
                <Lbl l="Preferred creative direction" full><textarea rows={3} className="field" value={s.campaign.direction} onChange={(e) => sub("campaign", "direction", e.target.value)} placeholder="Colours, mood, style, brands you like…" /></Lbl>
              </div></div>
          )}

          {step === 3 && (
            <div><h2 className="h-display text-3xl">Services required</h2>
              <p className="mt-2 text-sm text-mute">{pkg ? `Included in ${pkg.name}. Need more? Add extras below.` : custom ? "Tell us roughly what you need. We will prepare a custom quote." : "Choose the quantity of each service you need."}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">{stepper("banner", "Banner design")}{stepper("flyer", "Flyer design")}{stepper("email", "Email copywriting")}{stepper("social", "Social media design")}</div>
              {errors.services && <p role="alert" className="mt-3 text-sm text-red-400">{errors.services}</p>}
              {addonList.length > 0 && <div className="mt-8"><h3 className="label !text-white/60">Optional add-ons</h3>
                <ul className="mt-3 space-y-2">{addonList.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-surface p-3.5 text-sm">
                    <span>{a.name}{a.note && <span className="ml-2 text-xs text-mute">({a.note})</span>}<span className="ml-2 text-lime">+{money(a.price)}</span></span>
                    <span className="flex items-center gap-2"><button type="button" aria-label={`Remove ${a.name}`} onClick={() => set("addons", { ...s.addons, [a.id]: Math.max(0, (s.addons[a.id] || 0) - 1) })} className="h-9 w-9 rounded-full border border-white/20">−</button><output className="w-5 text-center">{s.addons[a.id] || 0}</output><button type="button" aria-label={`Add ${a.name}`} onClick={() => set("addons", { ...s.addons, [a.id]: Math.min(20, (s.addons[a.id] || 0) + 1) })} className="h-9 w-9 rounded-full border border-white/20">+</button></span>
                  </li>))}</ul></div>}
            </div>
          )}

          {step === 4 && (
            <div><h2 className="h-display text-3xl">Upload project assets</h2>
              <p className="mt-2 text-sm text-mute">Logo, brand guidelines, product photos, mockups, existing designs and references. Files are stored privately and only the Ignixales team can see them.</p>
              <div className="mt-5 max-w-sm"><Lbl l="These files are…"><select className="field" value={category} onChange={(e) => setCategory(e.target.value)}>{FILE_CATEGORIES.map((c) => <option key={c} value={c}>{CAT_LABEL[c]}</option>)}</select></Lbl></div>
              <label onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
                className={cn("mt-5 flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed p-8 text-center transition focus-within:border-lime", drag ? "border-lime bg-lime/10" : "border-white/25 bg-surface hover:border-lime/60")}>
                <svg className="h-10 w-10 text-lime" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 16V4m0 0L7 9m5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>
                <span className="mt-3 font-display text-2xl uppercase">Drag &amp; drop files here</span><span className="mt-1 text-sm text-mute">or <span className="text-lime underline">browse your device</span></span>
                <span className="mt-3 text-xs text-mute">{ALLOWED_EXT.join(", ").toUpperCase()} · up to {MAX_FILE_MB} MB each · up to {MAX_FILES} files</span>
                <input type="file" multiple accept=".png,.jpg,.jpeg,.webp,.pdf,.svg,.zip" className="sr-only" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
              </label>
              {errors.files && <p role="alert" className="mt-3 text-sm text-red-400">{errors.files}</p>}
              {files.length > 0 && <ul className="mt-5 space-y-2" aria-live="polite">{files.map((f) => (
                <li key={f.key} className="flex items-center gap-3 rounded-xl border border-white/10 bg-card p-3">
                  {f.preview ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={f.preview} alt="" className="h-12 w-12 rounded-lg object-cover" /> : <span className="grid h-12 w-12 flex-none place-items-center rounded-lg bg-surface text-[10px] font-bold uppercase text-mute">{f.name.split(".").pop()}</span>}
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{f.name}</p>
                    <p className="text-xs text-mute">{fmtSize(f.size)} · {CAT_LABEL[f.category]}</p>
                    {f.error ? <p role="alert" className="mt-1 text-xs text-red-400">{f.error}</p> : <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={f.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Upload progress for ${f.name}`}><div className={cn("h-full rounded-full transition-all", f.progress === 100 ? "bg-lime" : "bg-lime/70")} style={{ width: `${f.progress}%` }} /></div>}</div>
                  <button type="button" onClick={() => removeFile(f)} aria-label={`Remove ${f.name}`} className="h-9 w-9 flex-none rounded-full border border-white/15 text-lg hover:border-red-400 hover:text-red-400">×</button>
                </li>))}</ul>}
              <p className="mt-4 text-xs text-mute">No files yet? You can skip this step and send assets later by email.</p>
            </div>
          )}

          {step === 5 && (
            <div><h2 className="h-display text-3xl">Additional information</h2>
              <div className="mt-6 grid gap-5">
                <Lbl l="Project description"><textarea rows={4} className="field" value={s.extra.description} onChange={(e) => sub("extra", "description", e.target.value)} /></Lbl>
                <Lbl l="Reference links"><textarea rows={3} className="field" value={s.extra.links} onChange={(e) => sub("extra", "links", e.target.value)} placeholder="One link per line" /></Lbl>
                <Lbl l="Special instructions"><textarea rows={3} className="field" value={s.extra.instructions} onChange={(e) => sub("extra", "instructions", e.target.value)} /></Lbl>
                <Lbl l="Preferred communication method"><select className="field" value={s.extra.contactMethod} onChange={(e) => sub("extra", "contactMethod", e.target.value)}><option value="email">Email</option><option value="whatsapp">WhatsApp</option><option value="phone">Phone</option><option value="video-call">Video call</option></select></Lbl>
              </div></div>
          )}

          {step === 6 && (
            <div><h2 className="h-display text-3xl">Review &amp; submit</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <dl className="card p-5"><h3 className="label mb-2">Package &amp; services</h3>{row("Package", pkgName)}{row("Banners", String(s.services.banner))}{row("Flyers", String(s.services.flyer))}{row("Social designs", String(s.services.social))}{row("Email copies", String(s.services.email))}{addonArr.filter((a) => addonList.some((x) => x.id === a.id)).map((a) => row(addons.find((x) => x.id === a.id)!.name, `× ${a.qty}`))}</dl>
                <dl className="card p-5"><h3 className="label mb-2">Customer</h3>{row("Name", s.customer.fullName)}{row("Business", s.customer.businessName)}{row("Email", s.customer.email)}{row("Website", s.customer.websiteUrl)}{row("Country", s.customer.country)}{row("Industry", s.customer.industry)}{row("Platform", s.customer.platform)}</dl>
                <dl className="card p-5"><h3 className="label mb-2">Campaign</h3>{row("Name", s.campaign.name)}{row("Type", s.campaign.type)}{row("Dates", [s.campaign.startDate, s.campaign.endDate].filter(Boolean).join(" → "))}{row("Offer", s.campaign.offer)}{row("Objective", s.campaign.objective)}</dl>
                <dl className="card p-5"><h3 className="label mb-2">Uploaded files ({files.filter((f) => f.id).length})</h3>{files.filter((f) => f.id).map((f) => <div key={f.key} className="truncate border-b border-white/10 py-2 text-sm">{f.name}</div>)}{!files.some((f) => f.id) && <p className="text-sm text-mute">No files uploaded.</p>}</dl>
              </div>
              <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm"><input type="checkbox" checked={s.terms} onChange={(e) => { set("terms", e.target.checked); setErrors({}); }} className="mt-1 h-5 w-5 accent-[#D8FF00]" /><span>I agree to the <a href="/terms" target="_blank" className="text-lime underline">Terms &amp; Conditions</a> and <a href="/privacy" target="_blank" className="text-lime underline">Privacy Policy</a>.</span></label>
              {errors.terms && <p role="alert" className="mt-2 text-sm text-red-400">{errors.terms}</p>}
              <Turnstile />
              {submitError && <p role="alert" className="mt-4 rounded-lg border border-red-400/40 bg-red-400/10 p-3 text-sm text-red-300">{submitError}</p>}
              {Object.keys(errors).filter((k) => k.includes(".")).length > 0 && <p role="alert" className="mt-3 text-sm text-red-400">Some details need attention. Go back to the earlier steps to fix them.</p>}
              <p className="mt-4 text-xs text-mute">Submitting is a request, not a payment. We will review your brief and confirm details and payment with you. {responseTime}</p>
            </div>
          )}

          <div className="mt-10 flex items-center justify-between gap-3">
            <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className="btn btn-ghost disabled:invisible">Back</button>
            {step < 6 ? <button type="button" onClick={next} disabled={uploading && step === 4} className="btn btn-lime">{uploading && step === 4 ? "Uploading…" : "Continue"}</button>
              : <button type="button" onClick={submit} disabled={sending || uploading} className="btn btn-lime">{sending ? "Submitting…" : "Submit my project"}</button>}
          </div>
        </div>

        <aside className="card h-fit p-5 lg:sticky lg:top-28" aria-label="Order summary">
          <h3 className="label">Order summary</h3>
          <p className="mt-3 font-display text-2xl uppercase">{pkgName}</p>
          <ul className="mt-3 space-y-1.5 text-sm text-mute">{est.lines.map((l) => <li key={l.label} className="flex justify-between gap-3"><span>{l.label}</span><span className="text-white">{money(l.amount)}</span></li>)}</ul>
          <div className="mt-4 flex items-baseline justify-between border-t border-white/10 pt-4"><span className="text-sm text-mute">Estimated price</span><span className="font-display text-4xl text-lime">{est.isQuote ? "Quote" : money(est.total)}</span></div>
          <p className="mt-2 text-xs text-mute">{est.isQuote ? "We will prepare a custom quote after reviewing your brief." : "Estimate based on starting prices. Final price is confirmed before work begins."}</p>
          {pkg && <p className="mt-3 text-xs text-mute">Typical delivery: {pkg.delivery} · {pkg.revisions}</p>}
        </aside>
      </div>
    </div>
  );
}
