/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "principal": "#344966",
        "secundario": "rgba(52,73,102,0.17)",
        "detalles": "#B0C4DE",
        "background": "#F0F4F8",
        "background_2": "#C3A0B0",
        "background_3": "#D4A6B9",
        "accent-soft-blue": "#A5C9E6", 
        "accent-muted-green": "#B8E0D2",
        "accent-subtle-lavender": "#D8D2E1",
        "text-primary": "#2C3E50",
        "text-secondary": "#617487",
        "success": "#7DB9B3",
        "warning": "#F3D250",
        "error": "#E27D8B"
    }
    },
  },
  plugins: [],
}