export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        display: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        brand: {
          primary: "#0B0B10",
          secondary: "#0B0B10",
          accent: "#200B0B",
          "accent-dark": "#1a0808",
        },
        gray: {
          50: "#F2F6FA",
          100: "#E4EEF4",
          200: "#2a2a35",
          300: "#A6C2D6",
          400: "#7FA4BF",
          500: "#5A86A8",
          600: "#3E6A8D",
          700: "#1a1a25",
          800: "#0f0f15",
          900: "#0b0b10",
          950: "#0b0b10",
        },
        blue: {
          300: "#2a2a35",
          400: "#1E6791",
          500: "#200b0b",
          600: "#0f0f15",
          700: "#200b0b",
          800: "#0b0b10",
        },
        cyan: {
          400: "#22d3ee",
          500: "#06b6d4",
        },
        purple: {
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
        },
        green: {
          400: "#4ade80",
          500: "#22c55e",
        },
        dark: "#0C192A",
        "dark-secondary": "#1A3B55",
        "dark-tertiary": "#2A526F",
      },
    },
  },
  plugins: [],
}
