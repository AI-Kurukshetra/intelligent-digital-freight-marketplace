import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0d1726",
        slate: "#2f425d",
        mist: "#f4f7fb",
        accent: "#0f6cbd",
        surge: "#f97316",
        sea: "#14b8a6"
      },
      boxShadow: {
        soft: "0 22px 60px -24px rgba(13, 23, 38, 0.35)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(15, 108, 189, 0.18), transparent 32%), radial-gradient(circle at bottom right, rgba(249, 115, 22, 0.16), transparent 24%)"
      }
    }
  },
  plugins: []
};

export default config;
