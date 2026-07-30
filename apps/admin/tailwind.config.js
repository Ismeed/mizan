/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A4731',
        secondary: '#C9A84C',
        background: '#0D1F17',
        surface: '#1A3328',
        cream: '#F5F0E8',
      },
    },
  },
  plugins: [],
}
