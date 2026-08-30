/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Manrope', 'sans-serif'],
      },
      colors: {
        bg: "#F9F6F0",
        surface: "#FFFFFF",
        ink: "#1C2A24",
        muted: "#5C6A63",
        primary: {
          DEFAULT: "#2B5341",
          hover: "#3B6D57",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#C05C3D",
          hover: "#D96C4A",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#E2CBA3",
          hover: "#F0D9B1",
          foreground: "#1C2A24",
        },
        line: "#E2CBA3",
      },
      boxShadow: {
        soft: "0 6px 24px rgba(28, 42, 36, 0.06)",
        card: "0 2px 8px rgba(28, 42, 36, 0.04)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
