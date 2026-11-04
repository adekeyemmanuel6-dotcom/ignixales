const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export const row = (k: string, v?: string | number | null) => v ? `<tr><td style="padding:4px 12px 4px 0;color:#666">${esc(k)}</td><td style="padding:4px 0"><b>${esc(String(v))}</b></td></tr>` : "";
export const wrap = (title: string, body: string) =>
  `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;color:#111"><div style="background:#090A0B;color:#D8FF00;padding:18px 22px;font-weight:800;letter-spacing:.08em">IGNIXALES</div><div style="padding:22px"><h2 style="margin:0 0 12px">${esc(title)}</h2>${body}</div></div>`;

/** Sends via Resend when RESEND_API_KEY is set; otherwise logs (so local dev never fails). */
export async function sendEmail(opts: { to: string | string[]; subject: string; html: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) { console.log(`[email:dev] RESEND_API_KEY not set, email NOT sent. to=${[opts.to].flat().join(",")} subject="${opts.subject}"`); return false; }
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ from: process.env.EMAIL_FROM || "Ignixales <onboarding@resend.dev>", to: opts.to, subject: opts.subject, html: opts.html, reply_to: opts.replyTo }),
    });
    if (!r.ok) console.error("[email] failed", r.status, await r.text());
    return r.ok;
  } catch (e) { console.error("[email] error", e); return false; }
}
/** Team notification recipients: comma-separated TEAM_NOTIFY_EMAIL, defaulting to the owner's address. */
export const teamEmail = () =>
  (process.env.TEAM_NOTIFY_EMAIL || "adekeyemmanuel6@gmail.com").split(",").map((e) => e.trim()).filter(Boolean);
