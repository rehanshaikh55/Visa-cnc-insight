import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts}",      // ← catches utils.ts dynamic classes
    "./src/store/**/*.{js,ts}",
    "./src/hooks/**/*.{js,ts}",
  ],
  safelist: [
    // dynamic state-color classes built at runtime in utils.ts
    "border-l-operating", "border-l-idle", "border-l-off",
    "bg-operating",       "bg-idle",       "bg-off",
    "text-operating",     "text-idle",     "text-off",
    "animate-pulse-dot",
  ],
  theme: {
    extend: {
      screens: {
        xs: '375px',
      },
      colors: {
        surface: "#f4f7fb",
        card: "#ffffff",
        "card-border": "#dcdde1",
        accent: "#0a3d62",
        "text-primary": "#1a1a1a",
        "text-secondary": "#636e72",
        operating: "#2ecc71",
        idle: "#f39c12",
        off: "#e74c3c",
      },
      animation: {
        "pulse-dot": "pulse-dot 1.5s ease-in-out infinite",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.3)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
