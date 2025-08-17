/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {
    colors: {
        white: "#FFFFFF",
        purple: {
          100: "#A690FF",
          200: "#6D65F8",
          300: "#A960B0",
          400: "#6C51C7",
          500: "#440183",
        }
      }
  } },
  plugins: [],
}
