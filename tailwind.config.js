/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#050505',
        card: '#0f0f0f',
        primary: '#E63946',
        secondary: '#FF6B6B',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0A0',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(230, 57, 70, 0.3)',
        'glow-red-lg': '0 0 40px rgba(230, 57, 70, 0.4)',
      },
    },
  },
  plugins: [],
}
