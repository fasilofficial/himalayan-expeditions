/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      fontSize: {
        xs: [
          "0.75rem",
          { lineHeight: "1.2", letterSpacing: "0.02em", fontWeight: "400" },
        ],
        sm: [
          "0.875rem",
          { lineHeight: "1.3", letterSpacing: "0.02em", fontWeight: "400" },
        ],
        base: [
          "1rem",
          { lineHeight: "1.5", letterSpacing: "0.02em", fontWeight: "400" },
        ],
        lg: [
          "1.125rem",
          { lineHeight: "1.5", letterSpacing: "0.02em", fontWeight: "400" },
        ],
        xl: [
          "1.25rem",
          { lineHeight: "1.5", letterSpacing: "0.02em", fontWeight: "500" },
        ],
        "2xl": [
          "1.5rem",
          { lineHeight: "1.4", letterSpacing: "0.02em", fontWeight: "500" },
        ],
        "3xl": [
          "1.875rem",
          { lineHeight: "1.3", letterSpacing: "0.02em", fontWeight: "600" },
        ],
        "4xl": [
          "2.25rem",
          { lineHeight: "1.2", letterSpacing: "0.02em", fontWeight: "600" },
        ],
        "5xl": [
          "3rem",
          { lineHeight: "1.2", letterSpacing: "0.02em", fontWeight: "700" },
        ],
        "6xl": [
          "3.75rem",
          { lineHeight: "1.1", letterSpacing: "0.02em", fontWeight: "700" },
        ],
        "7xl": [
          "4.5rem",
          { lineHeight: "1.1", letterSpacing: "0.02em", fontWeight: "700" },
        ],
        "8xl": [
          "6rem",
          { lineHeight: "1.0", letterSpacing: "0.02em", fontWeight: "700" },
        ],
        "9xl": [
          "8rem",
          { lineHeight: "1.0", letterSpacing: "0.02em", fontWeight: "700" },
        ],
      },
      fontFamily: {
        heading: ["Inter", "sans-serif"],
        paragraph: ["Inter", "sans-serif"],
      },
      colors: {
        "accent-blue": "#607D8B",
        destructive: "#E53935",
        "destructive-foreground": "#FFFFFF",
        background: "#FFFFFF",
        secondary: "#555555",
        foreground: "#333333",
        "secondary-foreground": "#FFFFFF",
        "primary-foreground": "#FFFFFF",
        primary: "#333333",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [
    require("@tailwindcss/container-queries"),
    require("@tailwindcss/typography"),
  ],
};
