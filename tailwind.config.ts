import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1C1B2E",
          soft: "#5B5A70",
          faint: "#9A98AC",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          soft: "#F6F5FB",
          softer: "#EFEDF9",
        },
        brand: {
          DEFAULT: "#332E73",
          light: "#4C4494",
          tint: "#EDEBFB",
          dark: "#211D4E",
        },
        english: {
          DEFAULT: "#1D5FE0",
          tint: "#E8F0FE",
          dark: "#14459E",
        },
        japanese: {
          DEFAULT: "#E2604A",
          tint: "#FCEBE7",
          dark: "#B84631",
        },
        chinese: {
          DEFAULT: "#DB8A3A",
          tint: "#FBEEDD",
          dark: "#B36A21",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-pretendard)",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
        "serif-jp": ["var(--font-noto-serif-jp)", "serif"],
        "serif-sc": ["var(--font-noto-serif-sc)", "serif"],
      },
      borderRadius: {
        xl2: "1.75rem",
        xl3: "2.25rem",
      },
      boxShadow: {
        soft: "0 20px 45px -25px rgba(28, 27, 46, 0.25)",
        card: "0 16px 40px -28px rgba(28, 27, 46, 0.35)",
      },
      maxWidth: {
        content: "1280px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-16px) translateX(8px)" },
        },
        "dot-fade": {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" },
        },
        "dot-in": {
          "0%": { opacity: "0", transform: "translateY(3px) scale(0.6)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "mega-menu-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "hero-item": {
          "0%": { opacity: "0", transform: "translateY(16px)", filter: "blur(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        float: "float 4.5s ease-in-out infinite",
        "float-delayed": "float 5.2s ease-in-out infinite 0.5s",
        "float-slow": "float-slow 10s ease-in-out infinite",
        "float-slow-delayed": "float-slow 12s ease-in-out infinite 1.2s",
        "dot-fade": "dot-fade 1.6s ease-in-out infinite",
        "mega-menu-in": "mega-menu-in 0.16s ease-out both",
        "hero-item": "hero-item 0.5s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
