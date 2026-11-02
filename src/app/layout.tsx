import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/utils";

const display = Anton({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Ignixales | E-commerce Campaign Creative Studio", template: "%s" },
  description: "Ignite Your Sales. Ignixales designs banners, flyers and social creatives and writes promotional email copy for e-commerce brands' Black Friday, Christmas and New Year campaigns.",
  openGraph: { type: "website", siteName: "Ignixales", title: "Ignixales | Your E-commerce Campaign Creative Partner", description: "Ignite Your Sales. Seasonal campaign creative for online stores." },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};
export const viewport: Viewport = { themeColor: "#090A0B", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
