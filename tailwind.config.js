/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0052cc',
        secondary: '#f4f5f7',
        accent: '#4c9aff',
        success: '#36b37e',
        danger: '#ff5630',
      },
      keyframes: {
        'subtle-bounce': {
          '0%, 100%': { transform: 'translateY(-2%)' },
          '50%': { transform: 'translateY(0)' },
        }
      },
      animation: {
        'subtle-bounce': 'subtle-bounce 1.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}

