/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#FFE66D',
        surface: '#2A2D3A',
        background: '#1F2128',
        success: '#95E1D3',
        warning: '#FFA502',
        error: '#EE5A6F',
        info: '#54A0FF'
      },
      fontFamily: {
        display: ['Fredoka One', 'cursive'],
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '0.875rem',
        'lg': '1.125rem',
        'xl': '1.375rem',
        '2xl': '1.75rem',
        '3xl': '2.25rem',
      },
      borderRadius: {
        'DEFAULT': '8px',
      },
      boxShadow: {
        'panel': '0 4px 8px rgba(0, 0, 0, 0.2)',
        'button': '0 2px 4px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}