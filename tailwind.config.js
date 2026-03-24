/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#090910",
          1: "#11111c",
          2: "#191927",
          3: "#212133",
          4: "#2d2d47",
        },
        accent: {
          lime: "#a3e635",
          "lime-dim": "#84cc16",
          teal: "#2dd4bf",
          "teal-dim": "#14b8a6",
          violet: "#a78bfa",
          "violet-dim": "#8b5cf6",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.07)",
          bright: "rgba(255,255,255,0.12)",
        },
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        "float-x": {
          "0%, 100%": { transform: "translateX(0px) translateY(0px)" },
          "33%": { transform: "translateX(10px) translateY(-8px)" },
          "66%": { transform: "translateX(-6px) translateY(5px)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.93)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.75", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "toast-in": {
          "0%": { opacity: "0", transform: "translateY(-8px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "float-delayed": "float 9s ease-in-out infinite 2.5s",
        "float-slow": "float 12s ease-in-out infinite 5s",
        "float-x": "float-x 14s ease-in-out infinite",
        "fade-up": "fade-up 0.35s ease-out",
        "fade-in": "fade-in 0.25s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "slide-up": "slide-up 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
        "toast-in": "toast-in 0.25s ease-out",
      },
      boxShadow: {
        "glow-lime": "0 0 20px rgba(163,230,53,0.25)",
        "glow-teal": "0 0 20px rgba(45,212,191,0.25)",
        "glow-violet": "0 0 20px rgba(167,139,250,0.25)",
        glass: "0 8px 32px rgba(0,0,0,0.3)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-teal":
          "linear-gradient(135deg, rgba(45,212,191,0.15), transparent)",
        "gradient-violet":
          "linear-gradient(135deg, rgba(167,139,250,0.15), transparent)",
        "gradient-lime":
          "linear-gradient(135deg, rgba(163,230,53,0.12), transparent)",
      },
    },
  },
  plugins: [],
};
