"use client";
import { LazyMotion, MotionConfig, domMax, m, useScroll, useSpring, useTransform, type Variants } from "framer-motion";
import { useRef, type ReactNode, type ElementType, type CSSProperties } from "react";

/** Shared easing: a gentle "expo-out" used everywhere so the whole site moves the same way. */
export const ease = [0.22, 1, 0.36, 1] as const;

/** Wrap the app once. Honors the visitor's reduced-motion setting automatically. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={domMax} strict><MotionConfig reducedMotion="user" transition={{ duration: 0.7, ease }}>{children}</MotionConfig></LazyMotion>;
}

/** Fade + rise when scrolled into view (once). `lift` adds a subtle hover raise. */
export function Reveal({ children, className, delay = 0, y = 24, as = "div", lift, style }: { children: ReactNode; className?: string; delay?: number; y?: number; as?: ElementType; lift?: boolean; style?: CSSProperties }) {
  const C = (m as unknown as Record<string, ElementType>)[typeof as === "string" ? as : "div"] ?? m.div;
  return (
    <C className={className} style={style} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, ease, delay: delay / 1000 }} {...(lift ? { whileHover: { y: -6, transition: { duration: 0.3, ease } } } : {})}>
      {children}
    </C>
  );
}

const parent = (stagger: number, delay: number): Variants => ({ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } });
const child = (y: number, scale: number): Variants => ({ hidden: { opacity: 0, y, scale }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease } } });

/** Staggered group. `onView` waits for scroll; default plays on load. */
export function Stagger({ children, className, stagger = 0.09, delay = 0, onView }: { children: ReactNode; className?: string; stagger?: number; delay?: number; onView?: boolean }) {
  const props = onView ? { whileInView: "show", viewport: { once: true, margin: "0px 0px -8% 0px" } } : { animate: "show" };
  return <m.div className={className} variants={parent(stagger, delay)} initial="hidden" {...props}>{children}</m.div>;
}
export function StaggerItem({ children, className, y = 22, scale = 1 }: { children: ReactNode; className?: string; y?: number; scale?: number }) {
  return <m.div className={className} variants={child(y, scale)}>{children}</m.div>;
}

/** Headline where each line slides up from behind a mask. */
export function HeroHeadline({ lines, className }: { lines: { t: string; lime?: boolean }[]; className?: string }) {
  return (
    <h1 className={className}>
      {lines.map((l, i) => (
        <span key={l.t} className="block overflow-hidden py-[0.03em]">
          <m.span className={l.lime ? "block text-lime" : "block"} initial={{ y: "108%" }} animate={{ y: 0 }} transition={{ duration: 0.95, ease, delay: 0.08 + i * 0.1 }}>{l.t}</m.span>
        </span>
      ))}
    </h1>
  );
}

/** Slow vertical drift tied to scroll position. */
export function Parallax({ children, className, distance = 40 }: { children: ReactNode; className?: string; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return <m.div ref={ref} style={{ y }} className={className}>{children}</m.div>;
}

/** Thin lime reading-progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return <m.div aria-hidden style={{ scaleX }} className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-lime" />;
}
export { m };
