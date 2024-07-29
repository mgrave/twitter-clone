/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1DA1F2",
        light: "#1C2938",
        dark: "#FFFFFF",
        background: {
          light: "#F5F8FA",
          dark: "#161D25",
        },
        border: {
          light: "#E1E8ED",
          dark: "#38444D",
        },
        accent: {
          light: "#FFAD1F",
          dark: "#EAA741",
        },
        error: {
          light: "#E0245E",
          dark: "#F05D87",
        },
        success: {
          light: "#17BF63",
          dark: "#2BB67B",
        },
        warning: {
          light: "#FFAD1F",
          dark: "#EAA741",
        },
        info: {
          light: "#1DA1F2",
          dark: "#2795D9",
        },
      },
      fontFamily: {
        body: ["Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        heading: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
