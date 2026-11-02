import Link from "next/link";
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="Ignixales home" className={`inline-flex items-center gap-2 ${className}`}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime font-display text-lg leading-none text-black">IX</span>
      <span className="font-display text-xl uppercase tracking-wider">Ignixales</span>
    </Link>
  );
}
