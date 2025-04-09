import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: "#f0f7ff",
          100: "#e0f0ff",
          200: "#b9e0fe",
          300: "#7cc8fd",
          400: "#36aff9",
          500: "#0c96eb",
          600: "#0077cc",
          700: "#005fa5",
          800: "#064e87",
          900: "#0b426f",
          950: "#072a4d",
        },
        gray: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        heading: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
      boxShadow: {
        card: "0 2px 4px 0 rgba(0,0,0,0.05)",
        "card-hover": "0 4px 6px -1px rgba(0,0,0,0.1)",
        "dark-card": "0 2px 4px 0 rgba(0,0,0,0.3)",
        "dark-card-hover": "0 4px 6px -1px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
