import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const hasSupabase = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export const hasServiceRole = () => hasSupabase() && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

let admin: SupabaseClient | null = null;
/** Server-only client with the service-role key. Never import from client components. */
export function serviceClient(): SupabaseClient | null {
  if (!hasServiceRole()) return null;
  admin ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return admin;
}

export const BUCKET_PORTFOLIO = "portfolio";
export const BUCKET_ASSETS = "project-assets";

export function publicUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET_PORTFOLIO}/${path}`;
}
