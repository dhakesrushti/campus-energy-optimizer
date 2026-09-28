/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0F172A', // Slate 900
          card: 'rgba(30, 41, 59, 0.7)', // Slate 800 with opacity for glassmorphism
          border: 'rgba(255, 255, 255, 0.1)',
        },
        primary: {
          green: '#10B981', // Emerald 500
          blue: '#3B82F6', // Blue 500
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
