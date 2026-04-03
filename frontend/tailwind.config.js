/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        cream: {
          50: '#fdfcf9',
          100: '#faf7f0',
          200: '#f5efe0',
          300: '#ede1c8',
        },
        sage: {
          50: '#f3f7f4',
          100: '#e4eee6',
          200: '#c5d9c9',
          300: '#9abda0',
          400: '#6d9e76',
          500: '#4a7d55',
          600: '#3a6343',
          700: '#2f4f36',
        },
        warm: {
          50: '#fdf8f3',
          100: '#faeee0',
          200: '#f4d9bc',
          300: '#eabc8b',
          400: '#de9857',
          500: '#d4793a',
        },
        charcoal: {
          800: '#1c2120',
          900: '#111614',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-in': 'slideIn 0.5s ease forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      },
    },
  },
  plugins: [],
}

