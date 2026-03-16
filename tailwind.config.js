/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#090B10",
        panel: "#11151D",
        panelAlt: "#171C26",
        border: "#252B38",
        accent: "#8B5CF6",
        accentAlt: "#1DD6A4",
        lime: "#A3E635",
      },
      borderRadius: {
        xl2: "1rem",
      },
      boxShadow: {
        glow: "0 10px 25px rgba(139,92,246,0.16)",
        soft: "0 12px 40px rgba(0, 0, 0, 0.25)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 320ms ease-out",
      },
      fontFamily: {
        sans: ["'Space Grotesk'", "'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

