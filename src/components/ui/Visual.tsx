import type { ArtKind } from "@/lib/types";
import { CampaignArt } from "./CampaignArt";

/** Shows a real uploaded image when available, otherwise the drawn placeholder artwork. */
export function Visual({ img, kind, alt = "", concept }: { img?: string | null; kind: ArtKind; alt?: string; concept?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element
  if (img) return <img src={img} alt={alt} loading="lazy" className="h-full w-full object-cover" />;
  return <CampaignArt kind={kind} concept={concept} />;
}
