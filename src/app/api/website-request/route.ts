import { NextResponse } from "next/server";
import { serviceClient } from "@/lib/supabase";
import { websiteSchema } from "@/lib/validation";
import { clientIp, rateLimit, spamCheck } from "@/lib/rate-limit";
import { sendEmail, teamEmail, wrap, row } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const sb = serviceClient();
  if (!sb) return NextResponse.json({ error: "This form is not connected yet. Please email us directly." }, { status: 503 });
  const ip = clientIp(req);
  if (!rateLimit(`website-request:${ip}`, 5, 60 * 60_000)) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  const parsed = websiteSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check the highlighted fields.", fields: parsed.error.flatten().fieldErrors }, { status: 422 });
  const d = parsed.data;
  const spam = await spamCheck(d, ip);
  if (spam) return NextResponse.json({ error: spam }, { status: 400 });
  const { website_hp, started_at, turnstile, ...data } = d as Record<string, unknown>;
  const { error } = await sb.from("website_requests").insert({ data });
  if (error) { console.error(error); return NextResponse.json({ error: "We could not send your message. Please try again." }, { status: 500 }); }
  await sendEmail({
    to: teamEmail(), replyTo: d.email, subject: `New website development request: ${d.business}`,
    html: wrap("New website development request", `<table>${Object.entries(data).map(([k, v]) => row(k, v as string)).join("")}</table>`),
  });
  return NextResponse.json({ ok: true });
}
