/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "retro-gray": "#151923",
        "retro-black": "#090b10",
        "retro-white": "#f2f3f6",
        "retro-yellow": "#c9b780",
        miku: "#39C5BB",
        glass: "rgba(255,255,255,0.08)",
        "glass-line": "rgba(255,255,255,0.14)",
        "soft-ink": "#aeb5c4",
      },
      fontFamily: {
        mono: ["IBM Plex Mono", "monospace"],
        sans: ["DM Sans", "Arial", "sans-serif"],
        display: ["Manrope", "DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
