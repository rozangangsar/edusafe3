

/** @type {import('tailwindcss').Config} */
module.exports={
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily:
      {
        jakartasans: ["var(--font-jakartasan)","sans-serif"]
        

      },
      
      
      colors:{
        blue:
        {
          primary: "#00BFA6",
          dark: "#009e8c",
          light: "#33ccb9",
        },
        

      }
    },
  },
  plugins: [],
};
