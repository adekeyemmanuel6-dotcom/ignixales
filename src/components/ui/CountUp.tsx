"use client";
import { useEffect, useRef, useState } from "react";

/** Counts up only when given a real numeric value. Otherwise renders the text as-is. */
export function CountUp({ value, suffix = "" }: { value: string; suffix?: string }) {
  const n = Number(value.replace(/,/g, ""));
  const [v, setV] = useState(Number.isFinite(n) ? n : 0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!Number.isFinite(n) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setV(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => { const p = Math.min(1, (t - t0) / 1400); setV(Math.round(n * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [n]);
  if (!Number.isFinite(n)) return <span>{value}{suffix}</span>;
  return <span ref={ref}>{v.toLocaleString("en-US")}{suffix}</span>;
}
