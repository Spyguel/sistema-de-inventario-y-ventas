/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pastel-blue': '#AECBFA',
        'pastel-pink': '#FBC4AB',
        'pastel-yellow': '#FFFACD',
        'pastel-white': '#F8F8FF',
      },
    },
  },
  plugins: [],
}