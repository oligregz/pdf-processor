/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0A0A0A',
          surface: '#1A1616',
        },
        crimson: {
          DEFAULT: '#C81E1E',
          hover: '#A51818',
        },
        text: {
          main: '#F3F4F6',
          muted: '#9CA3AF',
        },
        status: {
          success: '#10B981',
          error: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Geist Sans', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}