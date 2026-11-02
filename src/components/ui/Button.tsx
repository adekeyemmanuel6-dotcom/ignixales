"use client";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

type V = "lime" | "ghost" | "dark" | "outline-dark";
const cls: Record<V, string> = { lime: "btn btn-lime", ghost: "btn btn-ghost", dark: "btn btn-dark", "outline-dark": "btn btn-outline-dark" };

/** Link styled as a button. Pass `event` to fire an analytics event on click. */
export function Btn({ href, variant = "lime", className, children, event, eventParams, ...rest }:
  { href: string; variant?: V; children: ReactNode; event?: string; eventParams?: Record<string, string> } & Omit<ComponentProps<typeof Link>, "href">) {
  return <Link href={href} className={cn(cls[variant], className)} onClick={event ? () => track(event, eventParams) : undefined} {...rest}>{children}</Link>;
}
export const Arrow = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
export function ALink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return <Link href={href} className={cn("link-arrow", className)}>{children}<Arrow /></Link>;
}
