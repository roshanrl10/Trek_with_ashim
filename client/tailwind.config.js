/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind which files to scan for class names
  // It removes unused styles in production — makes the CSS file tiny
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom colors for Trek with Ashim brand
      colors: {
        mountain: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        forest: {
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        earth: {
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
        }
      },
      // Custom fonts
      fontFamily: {
        heading: ['Georgia', 'serif'],   // elegant headings
        body:    ['Inter', 'sans-serif'], // clean body text
      },
    },
  },
  plugins: [],
}