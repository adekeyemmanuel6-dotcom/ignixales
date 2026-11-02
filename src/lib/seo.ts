import type { Metadata } from "next";
export const meta = (title: string, description: string, path: string, noindex = false): Metadata => ({
  title, description, alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "website", siteName: "Ignixales" },
  robots: noindex ? { index: false, follow: false } : undefined,
});
