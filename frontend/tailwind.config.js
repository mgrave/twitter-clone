/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        body: ["Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        heading: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
