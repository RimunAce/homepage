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
        "retro-gray": "#E0E0E0",
        "retro-black": "#000000",
        "retro-white": "#FFFFFF",
      },
      fontFamily: {
        mono: ["Courier New", "monospace"],
        sans: ["Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
