import type { Metadata } from "next";
import { meta } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Confirmation } from "@/components/site/Confirmation";
export const metadata: Metadata = meta("Project Received | Ignixales", "Your project has been received.", "/start-project/confirmation", true);
export default async function Page({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  return <Section className="!pt-36"><Confirmation refParam={ref?.slice(0, 40)} /></Section>;
}
