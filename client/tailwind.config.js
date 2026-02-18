/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This covers all subfolders in src
  ],
  theme: {
    extend: {
      colors: {
        darkBlue: '#171B36', // The sidebar color from your UI
        brandBlue: '#00A3FF', // The primary blue color
      },
    },
  },
  plugins: [],
}