/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
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
      }
    },
  },
  plugins: [],
} 