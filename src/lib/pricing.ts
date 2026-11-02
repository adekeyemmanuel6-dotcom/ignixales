import type { Package, Addon } from "./types";

/** Server-authoritative price estimate. Extra services beyond the package are priced from add-ons. */
export function estimate(pkg: Package | null, services: Package["qty"], addons: { id: string; qty: number }[], catalog: Addon[], individual = false) {
  let total = pkg?.price ?? 0;
  const lines: { label: string; amount: number }[] = pkg ? [{ label: pkg.name, amount: pkg.price }] : [];
  if (individual) {
    for (const [unit, qty] of Object.entries(services)) {
      const def = catalog.find((c) => c.unit === unit);
      if (def && qty > 0) { const amt = def.price * qty; total += amt; lines.push({ label: `${def.name} × ${qty}`, amount: amt }); }
    }
  }
  for (const a of addons) {
    const def = catalog.find((c) => c.id === a.id);
    if (!def) continue;
    const amt = def.price * a.qty;
    total += amt; lines.push({ label: `${def.name} × ${a.qty}`, amount: amt });
  }
  return { total, lines, isQuote: !pkg && !individual };
}
