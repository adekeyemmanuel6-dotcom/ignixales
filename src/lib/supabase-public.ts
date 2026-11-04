/** Client-safe public URL helper for the public `portfolio` bucket. */
export function publicUrl(path?: string | null) {
  if (!path) return null;
  if (/^https?:\/\//.test(path) || path.startsWith("/")) return path; // absolute URL or a site /public asset
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/${path}`;
}
