
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brandStart: "#2245ff",
        brandEnd: "#5ac8fa"
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #2245ff 0%, #5ac8fa 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(34,69,255,0.12) 0%, rgba(90,200,250,0.12) 100%)'
      }
    },
  },
  plugins: [],
}
