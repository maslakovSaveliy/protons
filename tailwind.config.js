/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'violet-accent': '#A928C9',
        'white': '#FAE9FF',
        'body': '#541161',
        'black': '#2E0738',
        'border': '#D9B9E2',
      },
      fontSize: {
        'body-l': ['22px', '24px'],
        'body-m': ['18px', '20px'],
      },
    },
  },
  plugins: [],
} 