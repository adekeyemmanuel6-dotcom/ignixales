import { NextResponse } from "next/server";
import { serviceClient } from "@/lib/supabase";
import { submissionSchema } from "@/lib/validation";
import { clientIp, rateLimit, spamCheck } from "@/lib/rate-limit";
import { getAddons, getAllPackages, getSettings } from "@/lib/content";
import { estimate } from "@/lib/pricing";
import { sendEmail, teamEmail, wrap, row } from "@/lib/email";
import { SITE_URL, money } from "@/lib/utils";

export const runtime = "nodejs";

const refId = () => {
  const d = new Date();
  const ymd = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  const rnd = Array.from(crypto.getRandomValues(new Uint8Array(3))).map((b) => b.toString(36).padStart(2, "0")).join("").slice(0, 4).toUpperCase();
  return `IGX-${ymd}-${rnd}`;
};

export async function POST(req: Request) {
  const sb = serviceClient();
  if (!sb) return NextResponse.json({ error: "Project submissions are not configured yet. Please email us directly." }, { status: 503 });
  const ip = clientIp(req);
  if (!rateLimit(`sub:${ip}`, 6, 60 * 60_000)) return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });

  const json = await req.json().catch(() => null);
  const parsed = submissionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the highlighted fields.", fields: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const d = parsed.data;
  const spam = await spamCheck(d, ip);
  if (spam) return NextResponse.json({ error: spam }, { status: 400 });

  const [packages, addons, settings] = await Promise.all([getAllPackages(), getAddons(), getSettings()]);
  const special = ["custom", "individual"].includes(d.packageSlug);
  const pkg = packages.find((p) => p.slug === d.packageSlug && p.enabled) ?? null;
  if (!pkg && !special) return NextResponse.json({ error: "That package is no longer available." }, { status: 422 });
  // add-ons only make sense alongside a package or an individual service request
  const validAddons = d.packageSlug === "custom" ? [] : d.addons.filter((a) => addons.some((x) => x.id === a.id));
  const est = estimate(pkg, d.services, validAddons, addons, d.packageSlug === "individual");

  const reference = refId();
  const { data: sub, error } = await sb.from("submissions").insert({
    reference, package_slug: d.packageSlug, services: d.services, addons: validAddons,
    customer: d.customer, campaign: d.campaign, extra: d.extra,
    estimated_price: est.isQuote ? null : est.total,
  }).select("id").single();
  if (error || !sub) { console.error(error); return NextResponse.json({ error: "We could not save your project. Please try again." }, { status: 500 }); }

  const { data: files } = await sb.from("submission_files").update({ submission_id: sub.id, draft_token: null })
    .eq("draft_token", d.draftToken).select("original_name");

  const pkgName = pkg?.name ?? (d.packageSlug === "custom" ? "Custom Package" : "Individual Service Request");
  const priceText = est.isQuote ? "Custom quote" : money(est.total);

  await Promise.allSettled([
    sendEmail({
      to: d.customer.email, subject: `We received your project (${reference})`,
      html: wrap("Thanks, your project is in.", `<p>Hi ${d.customer.fullName.split(" ")[0]}, we have received your brief for <b>${d.campaign.name}</b>.</p>
        <table>${row("Reference", reference)}${row("Package", pkgName)}${row("Estimated price", priceText)}${row("Files uploaded", files?.length ?? 0)}</table>
        <p><b>What happens next:</b> we review your brief and assets, then get in touch with confirmation, any questions and payment details. ${settings.responseTime}</p>
        <p>Questions? Reply to this email and quote your reference.</p>`),
    }),
    sendEmail({
      to: teamEmail(), replyTo: d.customer.email, subject: `New project ${reference}: ${d.customer.businessName} (${pkgName})`,
      html: wrap("New project submission", `<table>${row("Reference", reference)}${row("Package", pkgName)}${row("Estimate", priceText)}${row("Name", d.customer.fullName)}${row("Business", d.customer.businessName)}${row("Email", d.customer.email)}${row("Campaign", `${d.campaign.name} (${d.campaign.type})`)}${row("Files", files?.length ?? 0)}</table><p><a href="${SITE_URL}/admin/submissions/${sub.id}">Open in admin</a></p>`),
    }),
  ]);

  return NextResponse.json({ reference, package: pkgName, price: priceText, responseTime: settings.responseTime });
}
