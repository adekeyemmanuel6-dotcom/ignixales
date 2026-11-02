"use client";
import { useState } from "react";
import { fileLink } from "@/app/admin/actions";
export function FileDownload({ id }: { id: string }) {
  const [busy, setBusy] = useState(false);
  return <button disabled={busy} className="btn btn-ghost !min-h-[34px] !px-3 !py-1 !text-xs" onClick={async () => { setBusy(true); const u = await fileLink(id); setBusy(false); if (u) window.open(u, "_blank", "noopener"); else alert("Could not create a download link."); }}>{busy ? "…" : "Download"}</button>;
}
