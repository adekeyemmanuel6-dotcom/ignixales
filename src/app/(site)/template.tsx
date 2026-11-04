"use client";
import { m } from "framer-motion";
import { ease } from "@/components/ui/motion";

/** Re-mounts on every navigation, giving a smooth, quiet page-enter transition. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>{children}</m.div>;
}
