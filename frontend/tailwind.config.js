/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#7A1230',
          dark: '#5A0D23',
          light: '#9E1C42',
          surface: '#FDF6F8'
        },
        gold: {
          DEFAULT: '#A9803E',
          light: '#C79A52',
          dark: '#87632B'
        },
        sidebar: {
          DEFAULT: '#171B2B',
          hover: '#22273D',
          border: '#2C324B'
        },
        paper: {
          DEFAULT: '#FBF8F1',
          card: '#FFFFFF',
          border: '#E3D7C5'
        },
        academic: {
          surface: '#F8F9FA',
          border: '#C3C5D7',
          text: '#191C1D',
          muted: '#434654'
        }
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'sans-serif'],
        display: ['"Work Sans"', 'sans-serif']
      }
    },
  },
  plugins: [],
}
