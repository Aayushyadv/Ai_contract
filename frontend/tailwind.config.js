/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#0B1220',
          900: '#101A33',
          800: '#16213F',
        },
        indigo: {
          600: '#4338CA',
          500: '#4F46E5',
        },
        risk: {
          high: '#DC2626',
          medium: '#D97706',
          low: '#16A34A',
        },
        surface: '#F5F6F8',
      },
    },
  },
  plugins: [],
}