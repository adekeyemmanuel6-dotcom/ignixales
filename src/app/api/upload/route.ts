import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { serviceClient, BUCKET_ASSETS } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { ALLOWED_EXT, FILE_CATEGORIES, MAX_FILE_MB, MAX_FILES, MIME, fileExt, sniff } from "@/lib/validation";

/**
 * Direct-to-storage uploads (no file bytes pass through this function, so Vercel's 4.5 MB body limit
 * does not apply):
 *   1. op "sign"     – validate name/size/quota, return a one-time signed upload URL
 *   2. browser PUTs the file straight to Supabase Storage (private bucket)
 *   3. op "complete" – server re-reads the first bytes, verifies the real file type (magic bytes),
 *                      then records the file. Invalid files are deleted immediately.
 */
export const runtime = "nodejs";
const TOKEN = /^[a-zA-Z0-9-]{16,64}$/;
const err = (message: string, status = 400) => NextResponse.json({ error: message }, { status });

async function draftCount(token: string) {
  const sb = serviceClient()!;
  const { count } = await sb.from("submission_files").select("id", { count: "exact", head: true }).eq("draft_token", token);
  return count ?? 0;
}

export async function POST(req: Request) {
  const sb = serviceClient();
  if (!sb) return err("File storage is not configured yet. Please contact us to send your files.", 503);
  if (!rateLimit(`up:${clientIp(req)}`, 120, 10 * 60_000)) return err("Too many uploads. Please wait a few minutes and try again.", 429);
  const b = await req.json().catch(() => null);
  if (!b || !TOKEN.test(String(b.draftToken || ""))) return err("Invalid upload session. Refresh the page and try again.");
  const token = String(b.draftToken);
  const name = String(b.name || "");
  const ext = fileExt(name);
  const category = (FILE_CATEGORIES as readonly string[]).includes(b.category) ? b.category : "other";

  if (b.op === "sign") {
    const size = Number(b.size);
    if (!(ALLOWED_EXT as readonly string[]).includes(ext)) return err(`"${name}" is not a supported type. Allowed: ${ALLOWED_EXT.join(", ").toUpperCase()}.`);
    if (!Number.isFinite(size) || size <= 0) return err(`"${name}" is empty.`);
    if (size > MAX_FILE_MB * 1024 * 1024) return err(`"${name}" is larger than ${MAX_FILE_MB}MB.`, 413);
    if ((await draftCount(token)) >= MAX_FILES) return err(`You can upload up to ${MAX_FILES} files per project.`);
    const path = `drafts/${token}/${randomUUID()}.${ext}`;
    const { data, error } = await sb.storage.from(BUCKET_ASSETS).createSignedUploadUrl(path);
    if (error || !data) return err("Could not start the upload. Please try again.", 500);
    return NextResponse.json({ path, signedUrl: data.signedUrl });
  }

  if (b.op === "complete") {
    const path = String(b.path || "");
    if (!path.startsWith(`drafts/${token}/`) || path.includes("..")) return err("Invalid file.");
    if ((await draftCount(token)) >= MAX_FILES) { await sb.storage.from(BUCKET_ASSETS).remove([path]); return err(`You can upload up to ${MAX_FILES} files per project.`); }
    const signed = await sb.storage.from(BUCKET_ASSETS).createSignedUrl(path, 60);
    if (signed.error || !signed.data) return err("Upload could not be verified. Please try again.", 500);
    // only fetch the head of the file for sniffing; HEAD-style range keeps this cheap
    const r = await fetch(signed.data.signedUrl, { headers: { Range: "bytes=0-1048575" } });
    if (!r.ok && r.status !== 206) { await sb.storage.from(BUCKET_ASSETS).remove([path]); return err("Upload could not be verified. Please try again.", 500); }
    const head = Buffer.from(await r.arrayBuffer());
    const total = Number((r.headers.get("content-range") || "").split("/")[1]) || Number(r.headers.get("content-length")) || head.length;
    const pathExt = fileExt(path);
    if (total > MAX_FILE_MB * 1024 * 1024 || !sniff(head, pathExt)) {
      await sb.storage.from(BUCKET_ASSETS).remove([path]);
      return err(total > MAX_FILE_MB * 1024 * 1024 ? `"${name}" is larger than ${MAX_FILE_MB}MB.` : `"${name}" does not look like a valid .${pathExt} file.`, 422);
    }
    const { data, error } = await sb.from("submission_files").insert({ draft_token: token, path, original_name: name.slice(0, 200), mime: MIME[pathExt], size: total, category }).select("id").single();
    if (error) { await sb.storage.from(BUCKET_ASSETS).remove([path]); return err("Could not record the upload.", 500); }
    return NextResponse.json({ id: data.id });
  }
  return err("Bad request");
}

export async function DELETE(req: Request) {
  const sb = serviceClient();
  if (!sb) return err("Not configured", 503);
  const { draftToken, id } = await req.json().catch(() => ({}));
  if (!TOKEN.test(draftToken || "") || !id) return err("Bad request");
  const { data } = await sb.from("submission_files").select("path").eq("id", id).eq("draft_token", draftToken).maybeSingle();
  if (data) {
    await sb.storage.from(BUCKET_ASSETS).remove([data.path]);
    await sb.from("submission_files").delete().eq("id", id).eq("draft_token", draftToken);
  }
  return NextResponse.json({ ok: true });
}
