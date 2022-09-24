/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        superlive_blue: "#246BFD",
        superlive_gray_text: "#2F2F2F",
        superlive_background: "#111119",
        superlive_gray_input_text:
          "#505050",
        superlive_light_blue: "#EFFFFD",
      },
    },
  },
  plugins: [],
};
