import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Cookie-aware client used to read the signed-in admin session. */
export async function authClient() {
  const store = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try { list.forEach(({ name, value, options }) => store.set(name, value, options)); } catch { /* called from a Server Component */ }
      },
    },
  });
}

export const adminEmails = () =>
  (process.env.ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

/** Returns the admin user or null. Always verifies the JWT with Supabase (getUser) and the email allowlist. */
export async function getAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const sb = await authClient();
  const { data } = await sb.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  if (!email || !adminEmails().includes(email)) return null;
  return data.user;
}

export async function requireAdmin() {
  const u = await getAdmin();
  if (!u) throw new Error("Unauthorised");
  return u;
}
