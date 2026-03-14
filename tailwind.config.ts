import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        raleway: ["Raleway", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
      },
      colors: {
        gold: "#FFD700",
      },
      keyframes: {
        kenburns: {
          "0%":   { transform: "scale(1) translate(0,0)" },
          "100%": { transform: "scale(1.08) translate(-1%,-1%)" },
        },
        rotateLens: {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        floatParticle: {
          "0%":   { opacity: "0", transform: "translateY(100vh) scale(0)" },
          "20%":  { opacity: "0.6" },
          "80%":  { opacity: "0.3" },
          "100%": { opacity: "0", transform: "translateY(-10vh) scale(1.5)" },
        },
        loadFill: {
          from: { width: "0%" },
          to:   { width: "100%" },
        },
        scrollLeft: {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
        pulseGreen: {
          "0%,100%": { boxShadow: "0 0 20px rgba(37,211,102,0.4)" },
          "50%":     { boxShadow: "0 0 50px rgba(37,211,102,0.8)" },
        },
        scrollBounce: {
          "0%,100%": { transform: "translateY(0)" },
          "50%":     { transform: "translateY(8px)" },
        },
        bounceIn: {
          "0%":   { transform: "scale(0)" },
          "60%":  { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "kenburns":      "kenburns 12s ease-in-out infinite alternate",
        "rotate-slow-1": "rotateLens 20s linear infinite",
        "rotate-slow-2": "rotateLens 14s linear infinite reverse",
        "rotate-slow-3": "rotateLens 8s linear infinite",
        "float-particle":"floatParticle var(--dur,6s) var(--delay,0s) infinite",
        "load-fill":     "loadFill 2s ease-in-out forwards",
        "scroll-left":   "scrollLeft 35s linear infinite",
        "pulse-green":   "pulseGreen 2s infinite",
        "scroll-bounce": "scrollBounce 2s infinite",
        "bounce-in":     "bounceIn 0.6s forwards",
      },
    },
  },
  plugins: [],
};

export default config;
