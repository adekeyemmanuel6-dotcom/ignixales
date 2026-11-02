import type { CSSProperties, ReactNode } from "react";
import type { ArtKind } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Original, replaceable campaign mockups drawn with CSS (no stock imagery).
 * Sized with container-query units (cqmin) so they scale to any card.
 * Always shown as CONCEPT artwork until real project images are uploaded in /admin.
 */
const Box = ({ bg, children, className }: { bg: string; children: ReactNode; className?: string }) => (
  <div className={cn("relative h-full w-full overflow-hidden", className)} style={{ background: bg, containerType: "size" } as CSSProperties}>{children}</div>
);
const T = ({ children, s, c, x, y, w, className, style }: { children: ReactNode; s: number; c?: string; x?: number; y?: number; w?: number; className?: string; style?: CSSProperties }) => (
  <div className={cn("absolute font-display uppercase leading-[0.92] tracking-tight", className)} style={{ fontSize: `${s}cqmin`, color: c, left: x != null ? `${x}%` : undefined, top: y != null ? `${y}%` : undefined, width: w ? `${w}%` : undefined, ...style }}>{children}</div>
);
const Pill = ({ children, bg, c, x, y, s = 3 }: { children: ReactNode; bg: string; c: string; x: number; y: number; s?: number }) => (
  <div className="absolute rounded-full font-sans font-bold uppercase tracking-wider" style={{ background: bg, color: c, left: `${x}%`, top: `${y}%`, fontSize: `${s}cqmin`, padding: `${s * 0.5}cqmin ${s * 1.1}cqmin` }}>{children}</div>
);
const Dot = ({ x, y, d, bg }: { x: number; y: number; d: number; bg: string }) => (
  <div className="absolute rounded-full" style={{ left: `${x}%`, top: `${y}%`, width: `${d}cqmin`, height: `${d}cqmin`, background: bg }} />
);

const art: Record<ArtKind, () => ReactNode> = {
  "black-friday": () => (
    <Box bg="#0a0a0a">
      <div className="absolute -right-[10%] -top-[20%] h-[80%] w-[80%] rounded-full" style={{ background: "radial-gradient(circle,#D8FF0033,transparent 65%)" }} />
      <Pill bg="#D8FF00" c="#000" x={7} y={9} s={3}>Concept sale</Pill>
      <T s={21} c="#fff" x={7} y={24} w={86}>Black<br /><span style={{ color: "#D8FF00" }}>Friday</span></T>
      <T s={8} c="#fff" x={7} y={72} w={60}>Up to 50% off</T>
      <div className="absolute grid place-items-center rounded-full bg-[#D8FF00] text-black" style={{ right: "8%", bottom: "10%", width: "22cqmin", height: "22cqmin", transform: "rotate(12deg)" }}>
        <span className="font-display text-center leading-none" style={{ fontSize: "6cqmin" }}>SHOP<br />NOW</span>
      </div>
    </Box>
  ),
  christmas: () => (
    <Box bg="linear-gradient(160deg,#7a0f1c,#3d0610)">
      {[[12, 12], [30, 28], [70, 10], [85, 32], [55, 22], [20, 55], [90, 60]].map(([x, y], i) => <Dot key={i} x={x} y={y} d={1.2} bg="#ffffff88" />)}
      <T s={5} c="#E6C36A" x={8} y={9} className="!tracking-[0.3em]">Christmas edit</T>
      <T s={17} c="#F7E7B4" x={8} y={20} w={80}>The<br />gift<br />guide</T>
      <div className="absolute" style={{ right: "8%", bottom: "8%", width: "34cqmin", height: "44cqmin" }}>
        {[0, 1, 2].map((i) => <div key={i} className="absolute left-1/2 -translate-x-1/2" style={{ top: `${i * 24}%`, borderLeft: `${8 + i * 4}cqmin solid transparent`, borderRight: `${8 + i * 4}cqmin solid transparent`, borderBottom: `${14}cqmin solid #1f5a3a` }} />)}
        <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: 0, width: "4cqmin", height: "6cqmin", background: "#6b3b1b" }} />
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full" style={{ top: "-4%", width: "4cqmin", height: "4cqmin", background: "#E6C36A" }} />
      </div>
      <Pill bg="#E6C36A" c="#3d0610" x={8} y={78} s={3}>Free gift wrap</Pill>
    </Box>
  ),
  "new-year": () => (
    <Box bg="linear-gradient(135deg,#2540ff,#7b2cff 55%,#ff4fa3)">
      <Dot x={-10} y={55} d={60} bg="#ffffff14" />
      <T s={40} c="#fff" x={6} y={4} className="opacity-95">2027</T>
      <T s={12} c="#D8FF00" x={8} y={52} w={80}>New year.<br />New drop.</T>
      <Pill bg="#fff" c="#2540ff" x={8} y={84} s={3.2}>Fresh offers inside</Pill>
      {[[78, 62], [88, 72], [70, 78]].map(([x, y], i) => <Dot key={i} x={x} y={y} d={5 - i} bg="#D8FF00" />)}
    </Box>
  ),
  fashion: () => (
    <Box bg="#e9dfd2">
      <div className="absolute rounded-t-full bg-[#c9532f]" style={{ right: "8%", bottom: 0, width: "46%", height: "78%" }} />
      <div className="absolute rounded-t-full bg-[#1a1a1a]" style={{ right: "24%", bottom: 0, width: "30%", height: "52%" }} />
      <T s={5} c="#1a1a1a" x={8} y={9} className="!tracking-[0.3em]">Season sale</T>
      <T s={17} c="#1a1a1a" x={8} y={18} w={60}>Runway<br />sale</T>
      <Pill bg="#1a1a1a" c="#e9dfd2" x={8} y={78} s={3}>Up to 40% off</Pill>
    </Box>
  ),
  skincare: () => (
    <Box bg="linear-gradient(170deg,#ffd9c7,#f7b79b)">
      <div className="absolute rounded-full bg-white/50" style={{ right: "-12%", top: "-10%", width: "70%", height: "70%" }} />
      <div className="absolute rounded-[2cqmin] bg-[#fff6ef]" style={{ right: "22%", bottom: "10%", width: "20%", height: "46%", boxShadow: "0 3cqmin 6cqmin #00000022" }}><div className="mx-auto mt-[-6%] h-[10%] w-[50%] rounded-t bg-[#7a3b22]" /></div>
      <div className="absolute rounded-full bg-[#7a3b22]" style={{ right: "50%", bottom: "10%", width: "18%", height: "26%", borderRadius: "40% 40% 8% 8%" }} />
      <T s={5} c="#7a3b22" x={8} y={9} className="!tracking-[0.3em]">Skincare</T>
      <T s={14} c="#4a1f10" x={8} y={18} w={50}>Glow<br />ritual</T>
      <Pill bg="#4a1f10" c="#ffd9c7" x={8} y={80} s={3}>Gift sets 25% off</Pill>
    </Box>
  ),
  homepage: () => (
    <Box bg="#101215">
      <div className="absolute inset-[6%] overflow-hidden rounded-[1.6cqmin] border border-white/15 bg-[#16181b]">
        <div className="flex h-[10%] items-center gap-[1.2cqmin] border-b border-white/10 px-[2cqmin]">{[0, 1, 2].map((i) => <i key={i} className="block rounded-full bg-white/25" style={{ width: "1.2cqmin", height: "1.2cqmin" }} />)}<span className="ml-[3cqmin] block rounded bg-white/10" style={{ width: "30cqmin", height: "1.8cqmin" }} /></div>
        <div className="relative m-[3cqmin] overflow-hidden rounded-[1.4cqmin]" style={{ height: "46%", background: "linear-gradient(120deg,#D8FF00,#9be500)" }}>
          <T s={9} c="#000" x={5} y={14}>Mega sale<br />weekend</T>
          <Pill bg="#000" c="#D8FF00" x={5} y={72} s={2.4}>Shop now</Pill>
          <Dot x={70} y={-10} d={28} bg="#00000014" />
        </div>
        <div className="mx-[3cqmin] grid grid-cols-3 gap-[2cqmin]">{[0, 1, 2].map((i) => <div key={i} className="rounded-[1cqmin] bg-white/10" style={{ height: "12cqmin" }} />)}</div>
      </div>
    </Box>
  ),
  email: () => (
    <Box bg="#ecebe6">
      <div className="absolute inset-x-[10%] top-[6%] bottom-[6%] overflow-hidden rounded-[1.4cqmin] bg-white shadow-xl">
        <div className="bg-[#090A0B] px-[4cqmin] py-[2.4cqmin] font-display tracking-widest text-[#D8FF00]" style={{ fontSize: "3.4cqmin" }}>YOUR BRAND</div>
        <div className="px-[4cqmin] pt-[4cqmin]">
          <div className="font-sans font-bold uppercase text-black/40" style={{ fontSize: "2cqmin" }}>Subject line</div>
          <div className="font-display uppercase leading-none text-black" style={{ fontSize: "8cqmin", marginTop: "1cqmin" }}>Your cart is<br />on sale.</div>
          {[90, 80, 86, 60].map((w, i) => <div key={i} className="rounded bg-black/10" style={{ width: `${w}%`, height: "1.6cqmin", marginTop: "2cqmin" }} />)}
          <div className="mt-[4cqmin] inline-block rounded-full bg-[#D8FF00] font-sans font-bold uppercase" style={{ fontSize: "2.4cqmin", padding: "1.6cqmin 4cqmin" }}>Shop the sale</div>
        </div>
      </div>
    </Box>
  ),
  electronics: () => (
    <Box bg="linear-gradient(160deg,#0b1020,#16224a)">
      <div className="absolute rounded-[2cqmin] border border-[#6f8cff66] bg-[#1b2a5c]" style={{ right: "10%", top: "18%", width: "34%", height: "56%", boxShadow: "0 0 8cqmin #3d5dff55" }}><div className="m-[10%] h-[60%] rounded-[1.2cqmin]" style={{ background: "linear-gradient(160deg,#4f6bff,#9be7ff)" }} /></div>
      <T s={5} c="#8fa6ff" x={8} y={10} className="!tracking-[0.3em]">New year tech</T>
      <T s={15} c="#fff" x={8} y={20} w={50}>Volt<br />sale</T>
      <Pill bg="#D8FF00" c="#000" x={8} y={78} s={3}>From $49</Pill>
    </Box>
  ),
  social: () => (
    <Box bg="#d8ff00">
      <div className="absolute overflow-hidden rounded-[3cqmin] border-[1.2cqmin] border-black bg-black" style={{ left: "50%", top: "8%", bottom: "8%", width: "36%", transform: "translateX(-50%) rotate(-4deg)" }}>
        <div className="h-full" style={{ background: "linear-gradient(170deg,#ff4fa3,#ff9a4f)" }}>
          <T s={9} c="#fff" x={10} y={22} w={80}>Flash<br />sale</T>
          <Pill bg="#fff" c="#000" x={12} y={70} s={2.6}>Swipe up</Pill>
        </div>
      </div>
      <T s={6} c="#000" x={5} y={8} w={26}>Stories</T>
      <T s={6} c="#000" x={5} y={78} w={30}>Posts<br />& reels</T>
    </Box>
  ),
  flyer: () => (
    <Box bg="#f4f4f1">
      <div className="absolute inset-[7%] bg-[#090A0B] p-[6%]">
        <T s={4} c="#D8FF00" x={7} y={6} className="!tracking-[0.3em]">Gift guide</T>
        <T s={13} c="#fff" x={7} y={14} w={86}>Gifts they<br />will love</T>
        <div className="absolute inset-x-[7%] grid grid-cols-3 gap-[2cqmin]" style={{ bottom: "8%" }}>{["#D8FF00", "#fff", "#555"].map((c, i) => <div key={i} style={{ background: c, height: "22cqmin", opacity: i === 2 ? 0.6 : 1 }} />)}</div>
      </div>
    </Box>
  ),
  jewellery: () => (
    <Box bg="linear-gradient(160deg,#15110a,#2a2113)">
      <div className="absolute rounded-full border-[1.4cqmin] border-[#E6C36A]" style={{ right: "12%", top: "22%", width: "34%", height: "34%" }} />
      <div className="absolute rounded-full border-[1cqmin] border-[#E6C36A]/50" style={{ right: "22%", top: "32%", width: "34%", height: "34%" }} />
      <T s={14} c="#F7E7B4" x={8} y={20} w={50}>Gold<br />edit</T>
    </Box>
  ),
  home: () => (
    <Box bg="#d9e1d2">
      <div className="absolute rounded-t-[8cqmin] bg-[#6b7f5c]" style={{ right: "8%", bottom: 0, width: "38%", height: "60%" }} />
      <div className="absolute rounded-full bg-[#f0ede4]" style={{ right: "30%", bottom: "6%", width: "22%", height: "22%" }} />
      <T s={5} c="#3f4d35" x={8} y={9} className="!tracking-[0.3em]">Home bundle</T>
      <T s={14} c="#2c3624" x={8} y={18} w={50}>Cosy<br />season</T>
      <Pill bg="#2c3624" c="#d9e1d2" x={8} y={80} s={3}>Bundle & save</Pill>
    </Box>
  ),
};

export function CampaignArt({ kind, className, concept = false }: { kind: ArtKind; className?: string; concept?: boolean }) {
  return (
    <div className={cn("relative h-full w-full", className)} role="img" aria-label={`${kind.replace("-", " ")} campaign concept artwork`}>
      {art[kind]()}
      {concept && <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-white/80">Concept</span>}
    </div>
  );
}
