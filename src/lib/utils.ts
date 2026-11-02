import clsx, { type ClassValue } from "clsx";
export const cn = (...a: ClassValue[]) => clsx(a);
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const money = (n: number, cur = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(n);
export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
export const labelize = (s?: string | null) =>
  !s ? "" : s.split("-").map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ");
