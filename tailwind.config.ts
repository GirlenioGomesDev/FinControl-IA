import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#151515",
        pearl: "#f7f3ec",
        champagne: "#d8b46a",
        emerald: "#0e7c66",
        wine: "#6e243d"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(21, 21, 21, 0.08)",
        glow: "0 24px 70px rgba(14, 124, 102, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
