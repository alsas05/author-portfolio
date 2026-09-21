import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: "#FAF8F5",
          100: "#F5EFEB",
          200: "#EFE8DE",
          300: "#E4D9C8",
          400: "#D3C4AF",
          500: "#B8A389",
          600: "#8C7A65",
          700: "#5E5243",
          800: "#3D352B",
          900: "#1A1715",
        },
        ink: {
          50: "#ECEBEA",
          100: "#D4D2CF",
          200: "#A9A59F",
          300: "#7F7970",
          400: "#5A544C",
          500: "#3A352F",
          600: "#2B2621",
          700: "#221E1A",
          800: "#1A1715",
          900: "#12100E",
          950: "#0A0908",
        },
        gold: {
          50: "#FAF6EB",
          100: "#F2E8CB",
          200: "#E4D197",
          300: "#D4AF37",
          400: "#C5A059",
          500: "#B38C44",
          600: "#8C6D3B",
          700: "#695028",
          800: "#49371B",
          900: "#2E220F",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        quote: ["var(--font-quote)", "Playfair Display", "Georgia", "serif"],
      },
      boxShadow: {
        book: "0 18px 36px -12px rgba(18, 16, 14, 0.35), 0 6px 12px -4px rgba(18, 16, 14, 0.2)",
        "book-hover": "0 26px 48px -10px rgba(18, 16, 14, 0.45), 0 10px 18px -4px rgba(197, 160, 89, 0.15)",
        parchment: "0 4px 20px -2px rgba(38, 34, 32, 0.06), 0 2px 6px -1px rgba(38, 34, 32, 0.04)",
      },
      backgroundImage: {
        "noise-pattern": "radial-gradient(circle at 50% 50%, rgba(250, 247, 242, 0.03) 0%, rgba(18, 16, 14, 0.05) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
