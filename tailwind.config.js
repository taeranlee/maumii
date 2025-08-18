/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: { 
    extend: {
      fontFamily: {
        sans: ["Pretendard", "sans-serif"], 
      },
      fontSize: {
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['20px', '28px'],
        xl: ['24px', '32px'],
      },
      colors: {
        primary: "#A960B0" ,
        background: "#F8F6FF",
        notice: "#F9E000",  
        white: "#ffffff",
        icon: "#440183",
        notice : "#f9e000",

        button: {
        send:  "rgba(166,144,255,0.4)", 
        nav: "#6C51C7", 
        record: "#6D65F8",
        edit : "#A690FF"
        },
        cloud: {
          partner: "#BDD6F3",
          mine: "#F8CBDE",
        },
        bear: {
          partner: "#FAF2C7",
          mine: "#F8DCCB",
        },
        text: {
          100: "#79797B",
          200: "#5B5758",
          300: "#404040",
          400: "#080808",
        }
      }
    }
  },
  plugins: [],
}
