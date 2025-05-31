/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  variants: {
    extend: {
      display: ['portrait', 'landscape'],
    },
  },
  theme: {
    extend: {
      fontFamily: {
        rubik: ['Rubik', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(-100%)' }
        },
        keypress: {
          '0%, 100%': { backgroundColor: 'white' },
          '50%': { backgroundColor: '#d2f4f2' }
        }
      },
      animation: {
        keypress: 'keypress 0.5s ease-out',
        shimmer: 'shimmer 2s infinite'
      },
      colors: {
        background: {
          10: '#f2fcfb',
          50: '#ceeae8',
          100: '#d2f4f2',
          300: '#2ea199',
        },
        highlight: {
          110: '#c6f4e6',
          200: '#98e0db',  // dark cyan
        },
      },
    },
  },
  plugins: [],
} 