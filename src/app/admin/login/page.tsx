"use client";
import { useActionState } from "react";
import { login } from "../actions";
import { Logo } from "@/components/site/Logo";

export default function Login() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-5">
      <form action={action} className="card w-full max-w-sm space-y-4 p-7">
        <Logo /><h1 className="h-display pt-2 text-3xl">Admin sign in</h1>
        <label className="block"><span className="mb-1 block text-sm">Email</span><input name="email" type="email" required autoComplete="email" className="field" /></label>
        <label className="block"><span className="mb-1 block text-sm">Password</span><input name="password" type="password" required autoComplete="current-password" className="field" /></label>
        {state?.error && <p role="alert" className="text-sm text-red-400">{state.error}</p>}
        <button disabled={pending} className="btn btn-lime w-full">{pending ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}
