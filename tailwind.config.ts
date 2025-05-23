import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "text-primary": {
          DEFAULT: "var(--text-primary)",
          dark: "var(--text-primary-dark)",
        },
        "text-secondary": {
          DEFAULT: "var(--text-secondary)",
          dark: "var(--text-secondary-dark)",
        },
        "background-secondary": {
          DEFAULT: "var(--background-secondary)",
          dark: "var(--background-secondary-dark)",
        },
        "border-color": {
          DEFAULT: "var(--border-color)",
          dark: "var(--border-color-dark)",
        },
        "accent-primary": {
          DEFAULT: "var(--accent-primary)",
          dark: "var(--accent-primary-dark)",
        },
        "accent-secondary": {
          DEFAULT: "var(--accent-secondary)",
          dark: "var(--accent-secondary-dark)",
        },
      },
      size: {
        4: "1rem",
        10: "2.5rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
  ],
};

export default config satisfies Config;
