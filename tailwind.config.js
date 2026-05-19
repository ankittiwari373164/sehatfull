/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f0',
          100: '#faefd9',
          200: '#f5ddb3',
          300: '#eec47e',
          400: '#e6a84a',
          500: '#d4891a',
          600: '#b8720f',
          700: '#94590d',
          800: '#784811',
          900: '#623c12',
        },
        secondary: {
          50: '#f9f5ee',
          100: '#f1e7d0',
          200: '#e3cfa1',
          300: '#d3b170',
          400: '#c49449',
          500: '#b07a2e',
          600: '#8e6124',
          700: '#6d4b1e',
          800: '#59401e',
          900: '#4a361c',
        },
        cream: {
          50: '#fefcf7',
          100: '#fdf8ed',
          200: '#faf0d6',
          300: '#f6e4b5',
          400: '#f0d28e',
        },
        forest: {
          500: '#4a7c59',
          600: '#3a6347',
          700: '#2d4e38',
        },
        spice: {
          500: '#c4522a',
          600: '#a8421f',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Lato', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
