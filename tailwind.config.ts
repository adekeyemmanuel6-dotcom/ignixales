import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#090A0B", surface: "#141517", card: "#1B1D20",
        lime: { DEFAULT: "#D8FF00", 2: "#B9F500" },
        mute: "#A5A7AA", paper: "#F4F4F1", dark: "#111111",
      },
      fontFamily: {
        display: ["var(--font-display)", "Anton", "Impact", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderColor: { DEFAULT: "rgba(255,255,255,0.10)" },
      borderRadius: { card: "14px" },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
      },
      animation: { marquee: "marquee 40s linear infinite", float: "float 7s ease-in-out infinite" },
    },
  },
  plugins: [],
};
export default config;
