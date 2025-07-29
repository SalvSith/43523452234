/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'manrope': ['Manrope', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#8850e2',
        secondary: '#aca0bb',
        dark: '#2f2a5f',
        gray: {
          100: '#fcfcff',
          200: '#e9dfdf',
          300: '#6a6f73',
        }
      }
    },
  },
  plugins: [],
} 