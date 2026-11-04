"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";

const KEY = "igx-consent";
export function readConsent(): "granted" | "denied" | null {
  try { return (localStorage.getItem(KEY) as "granted" | "denied") || null; } catch { return null; }
}

/** Loads GTM / GA4 / Meta Pixel ONLY after the visitor accepts cookies. */
export function Analytics() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    setOk(readConsent() === "granted");
    const h = () => setOk(readConsent() === "granted");
    window.addEventListener("igx-consent", h);
    return () => window.removeEventListener("igx-consent", h);
  }, []);
  if (!ok) return null;
  const gtm = process.env.NEXT_PUBLIC_GTM_ID, ga = process.env.NEXT_PUBLIC_GA_ID, px = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  return (
    <>
      {gtm && <Script id="gtm" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=document.getElementsByTagName('script')[0],j=document.createElement('script');j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id=${gtm}';f.parentNode.insertBefore(j,f);`}</Script>}
      {ga && !gtm && (<>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
        <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga}');`}</Script>
      </>)}
      {px && <Script id="fbq" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${px}');fbq('track','PageView');`}</Script>}
    </>
  );
}

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => { setShow(readConsent() === null); }, []);
  const set = (v: "granted" | "denied") => { try { localStorage.setItem(KEY, v); } catch {} setShow(false); window.dispatchEvent(new Event("igx-consent")); };
  return (
    <AnimatePresence>{show && (
    <m.div role="dialog" aria-label="Cookie consent" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} transition={{ duration: 0.45, delay: 0.8 }} className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-2xl border border-white/15 bg-card/95 p-4 shadow-2xl backdrop-blur sm:p-5">
      <p className="text-sm text-white/80">We use cookies for analytics and to measure our campaigns. You choose; nothing optional loads until you accept. See our <a className="text-lime underline" href="/privacy">Privacy Policy</a>.</p>
      <div className="mt-3 flex gap-2">
        <button onClick={() => set("granted")} className="btn btn-lime !min-h-[40px] !px-5 !py-2 !text-xs">Accept</button>
        <button onClick={() => set("denied")} className="btn btn-ghost !min-h-[40px] !px-5 !py-2 !text-xs">Decline</button>
      </div>
    </m.div>)}</AnimatePresence>
  );
}
