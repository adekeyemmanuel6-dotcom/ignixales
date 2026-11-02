"use client";
import { useEffect, useState } from "react";
import { Btn, Arrow } from "@/components/ui/Button";

type C = { reference: string; package: string; price: string; responseTime: string; files?: number };
export function Confirmation({ refParam }: { refParam?: string }) {
  const [c, setC] = useState<C | null>(null);
  useEffect(() => { try { const v = sessionStorage.getItem("igx-confirmation"); if (v) setC(JSON.parse(v)); } catch {} }, []);
  const reference = c?.reference || refParam;
  const steps = ["We review your brief and uploaded assets.", "We email you to confirm scope, price and payment details.", "We create your campaign assets and share them for review.", "You request revisions if needed, then we deliver the approved files."];
  return (
    <div className="mx-auto max-w-3xl">
      <div role="status" className="card border-lime/40 p-8 text-center sm:p-12">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-lime text-black"><svg width="30" height="30" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5 6.5 11.5 12.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        <h1 className="h-display mt-6 text-[clamp(2.4rem,6vw,4rem)]">Project received.</h1>
        <p className="mt-3 text-mute">Thank you. A confirmation email is on its way to you.</p>
        {reference && <div className="mx-auto mt-8 inline-block rounded-xl border border-white/15 bg-surface px-6 py-4"><p className="text-xs uppercase tracking-wider text-mute">Project reference</p><p className="font-display text-3xl tracking-wide text-lime">{reference}</p></div>}
        {c && <dl className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-4 text-left text-sm"><div><dt className="text-mute">Package</dt><dd className="font-medium">{c.package}</dd></div><div><dt className="text-mute">Estimated price</dt><dd className="font-medium">{c.price}</dd></div></dl>}
      </div>
      <section className="mt-10"><h2 className="h-display text-3xl">What happens next</h2>
        <ol className="mt-5 space-y-3">{steps.map((t, i) => <li key={t} className="card flex gap-4 p-4"><span className="h-display text-2xl text-lime">0{i + 1}</span><span className="text-sm text-white/85">{t}</span></li>)}</ol>
        <p className="mt-5 text-sm text-mute"><b className="text-white">Expected response time:</b> {c?.responseTime || "We aim to reply within 1 business day."}</p></section>
      <div className="mt-8 flex flex-wrap gap-3"><Btn href="/work">Explore our work <Arrow /></Btn><Btn href="/" variant="ghost">Back to home</Btn></div>
    </div>
  );
}
