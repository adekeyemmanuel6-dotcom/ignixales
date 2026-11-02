// Simple in-memory limiter (per server instance). For multi-region deployments swap for Upstash/Redis.
const hits = new Map<string, number[]>();
export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= max) { hits.set(key, arr); return false; }
  arr.push(now); hits.set(key, arr);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return true;
}
export const clientIp = (req: Request) =>
  req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";

/** Honeypot + minimum fill time + optional Cloudflare Turnstile. Returns an error string or null. */
export async function spamCheck(body: { website_hp?: string; started_at?: number; turnstile?: string }, ip: string) {
  if (body.website_hp) return "Spam detected";
  if (body.started_at && Date.now() - body.started_at < 2500) return "Please take a moment to complete the form";
  if (process.env.TURNSTILE_SECRET_KEY) {
    if (!body.turnstile) return "Please complete the spam check";
    try {
      const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY, response: body.turnstile, remoteip: ip }),
      });
      if (!(await r.json()).success) return "Spam check failed, please retry";
    } catch { return "Spam check unavailable, please retry"; }
  }
  return null;
}
