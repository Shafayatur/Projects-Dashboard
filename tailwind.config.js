/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#000000",
        surface: "#000000",
        ink: "#FFFFFF",
        muted: "#8A8A8A",
        line: "#FFFFFF",
        lead: "#3DFF6E",   // ahead / winning — vivid, not muted
        gap: "#FF3B3B",    // behind / gap — vivid, not muted
        flag: "#FFD400"    // neutral highlight / attention
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"]
      }
    }
  },
  plugins: []
};
