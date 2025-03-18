/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens:{
        xs: "320px",
        sm: "375px",
        sml: "500px",
        md: "667px",
        mdl: "768px",
        lg: "960px",
        lgl: "1024px",
        xl: "1280px",
        xxl: "1320px"
      },
      fontFamily: {
        barlow: ['Barlow', 'serif'],
      },
      colors: {
        "primary":"#C68C4E",
        "btnClr": "#EF9F27",
        "btnClr2": "#B47000",
        "textClr": "#FCA210",
        "textPrimary": "#1E1E1E",
        "textSecondary": "#FFFFFF",
        "textInactive": "#7A869A",
        "successClr": "#007214",
        "strokeClr1": "#FF2F54",
        "strokeClr2": "#FE3838",
        "inactiveClr": "#E6EDF7",
        "surfacePrimary": "#FAF9F6",
      },
    },
  },
  plugins: [],
}