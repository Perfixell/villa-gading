/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCFA',
          100: '#FAF8F5',
          200: '#F5F0E8',
        },
        sand: {
          100: '#F5EDD8',
          200: '#E9DFC8',
          300: '#D9C9A8',
          400: '#C9B388',
        },
        sage: {
          100: '#C8D4C5',
          200: '#A8BDA4',
          300: '#8FA58B',
          400: '#6E8A6A',
          500: '#506650',
        },
        charcoal: {
          100: '#6B6B6B',
          200: '#4A4A4A',
          300: '#2E2E2E',
          400: '#1A1A1A',
        },
        gold: {
          100: '#E8D4B0',
          200: '#D4B882',
          300: '#B89052',
          400: '#9A7038',
          500: '#7A5420',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        luxury: '0 4px 30px rgba(0,0,0,0.08)',
        'luxury-md': '0 8px 40px rgba(0,0,0,0.12)',
        'luxury-lg': '0 20px 60px rgba(0,0,0,0.15)',
        gold: '0 4px 20px rgba(184,144,82,0.25)',
      },
    },
  },
  plugins: [],
};
