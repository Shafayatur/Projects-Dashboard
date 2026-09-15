/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0F1210",
        surface: "#171B18",
        surface2: "#1D221E",
        border: "#2A2F2B",
        ink: "#EDEDE6",
        muted: "#9AA49C",
        emerald: "#2E9B6F",
        emeraldSoft: "#1F6B4C",
        gold: "#D9A94E",
        red: "#C4644A"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"]
      }
    }
  },
  plugins: []
};
