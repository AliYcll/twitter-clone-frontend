/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D9BF0',
        'primary-hover': '#1A8CD8',
        'dark-bg': '#000000',
        'dark-card': '#16181C',
        'gray-text': '#71767B',
        'border-color': '#2F3336',
      }
    },
  },
  plugins: [],
}
