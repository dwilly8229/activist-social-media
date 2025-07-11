/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./public/index.html"
  ],
  darkMode: 'class', // Enable dark mode via a CSS class (e.g., <html class="dark">)
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#2563eb', // blue
          dark: '#8b5cf6',  // purple
        },
        background: {
          light: '#ffffff',
          dark: '#000000',
        },
      },
    },
  },
  plugins: [],
};
