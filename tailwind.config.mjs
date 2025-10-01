/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'noisy-grid': "url('/noisy-grid.png')",
        'vertical-wood': "url('/vertical_wood.png)",
        'paper': "url('/black-paper.png')",
        'cream-paper': "url('/cream-paper.png')",
        'wallpaper': "url('/soft-wallpaper.png')",
        'square': "url('/square-green.webp')",
        'square-crop': "url('/square-green-crop.png')",
        'square-dark': "url('/square-dark-green.webp')",
        'v2-wallpaper': "url('/background_strip_2.png')",
      },
      backgroundSize: {
        'small': '25%',
        'medium': '50%',
      },
      fontFamily: {
        'pg': ['var(--font-pg)'],
        'se': ['var(--font-se)'],
      },
      colors : {
        'light-green': '#73B700',
        'light-green-2': '#399c49',
        'dark-green': '#174E00',
        'dark-green-2': '#224728',
        'cream': '#FCF5E5',
        'brown': '#603C07',
        'trail-yellow': '#FFC100',
        'gray-1': '#7D7C85',
        'gray-2': '#3E3D43',
        'gray-3': '#494852',
        'need-blue': '#0f1230',
        'light-blue': '#99D6EA',
        'dark-blue': '#1B365D',
        'dark-blue-2': '#003B5C',
        'pg-red': '#CB2C30',
        'blue-grain': '#414F4E',
      },
      boxShadow: {
        'inner-search': '0px 0px 2px 1px #000 inset',
        'inner-dropdown': '0px 1px 2px 0px rgba(0, 0, 0, 0.50), 0px 2px 4px 0px rgba(0, 0, 0, 0.25) inset',
        'inner-show': '0px 0px 2px 1px #000 inset',
        'inner-button': '0px 0px 2px 1px rgba(0, 0, 0, 0.50) inset',
        'sidebar': '3px 0px 10px 0px rgba(0, 0, 0, 0.25)',
        'sidebar-mobile': '0px -2px 4px 0px rgba(0, 0, 0, 0.25)',
        'gallery': '20px 20px 20px 8px rgba(0, 0, 0, 0.50) inset',
        "outer-hard": '2px 2px 0px 0px #2B2D2A',
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" }
        }
      },
      animation: {
        wiggle: "wiggle 200ms ease-in-out"
      }
    },
  },
  plugins: [],
}

export default config