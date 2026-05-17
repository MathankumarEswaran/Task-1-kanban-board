/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#dde6ff',
          500: '#4f6ef7',
          600: '#3a57e8',
          700: '#2c43c9',
        },
        surface: {
          DEFAULT: '#0f1117',
          card:    '#181c28',
          hover:   '#1e2333',
          border:  '#2a2f45',
        },
      },
      boxShadow: {
        card: '0 2px 12px 0 rgba(0,0,0,0.45)',
        glow: '0 0 20px rgba(79,110,247,0.25)',
      },
      animation: {
        'fade-in':  'fadeIn 0.2s ease',
        'slide-up': 'slideUp 0.25s ease',
        'pop':      'pop 0.18s ease',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pop:     { '0%': { transform: 'scale(0.95)' }, '60%': { transform: 'scale(1.03)' }, '100%': { transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
}
