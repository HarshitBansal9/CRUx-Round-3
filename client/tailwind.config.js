/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'custom-background':'	#28282B',
        'jet-black':'#343434',
        'onyx':'	#353935',
        'licorice':'#18181a'
      }
    },
  },
  plugins: [
    function ({ addUtilities }){
      const newUtilities = {
        "no-scrollbar::-webkit-scrollbar": {
        display: "none",
        },
        "no-scrollbar": {
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
        },
      };
    addUtilities (newUtilities);
  }
  ],
}

