/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#1a1a2e',
        'bg-secondary': '#16213e',
        'bg-tertiary': '#0f3460',
        'text-primary': '#e4e4e7',
        'text-secondary': '#a1a1aa',
        'text-muted': '#71717a',
        'accent-primary': '#7c3aed',
        'accent-secondary': '#00d4ff',
      },
      fontFamily: {
        'sans': ['Space Grotesk', 'Segoe UI', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
