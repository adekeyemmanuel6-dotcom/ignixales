import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Analytics, CookieBanner } from "@/components/site/Analytics";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded focus:bg-lime focus:px-3 focus:py-2 focus:text-black">Skip to content</a>
      <Nav />
      <main id="main" className="page-fade">{children}</main>
      <Footer />
      <CookieBanner />
      <Analytics />
    </>
  );
}
