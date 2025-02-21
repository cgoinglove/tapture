/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(90deg, #00aaff, #ff00ff, #ff5500)',
      },
      colors: {
        background: 'var(--background)',
        softBackground: 'var(--softbackground)',
        foreground: 'var(--foreground)',
        hoverColor: 'var(--hoverColor)',
        subText: 'var(--subText)',
        ringColor: 'var(--ringColor)',
      },
      backgroundSize: {
        200: '400% 100%',
      },
      keyframes: {
        textUp: {
          '0%': {
            top: 0,
          },
          '33.33%': {
            top: '-100%',
          },
          '66.66%': {
            top: '-200%',
          },
          '100%': {
            top: '-300%',
          },
        },
        bounceX: {
          '0%, 100%': { transform: 'translateX(0)' },
          '30%': { transform: 'translateX(3px)' },
          '50%': { transform: 'translateX(-1.5px)' },
          '70%': { transform: 'translateX(2px)' },
        },
        gradientBorder: {
          '0%': { backgroundPosition: '0% 50%' },
          '25%': { backgroundPosition: '50% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '75%': { backgroundPosition: '50% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        drawCircle: {
          '0%': { strokeDashoffset: '251.3' },
          '100%': { strokeDashoffset: '0' },
        },
        drawPath: {
          '0%': { strokeDashoffset: '60' },
          '100%': { strokeDashoffset: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInTop: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInBottom: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutTop: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-100%)', opacity: '0' },
        },
        slideOutBottom: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        slideOutLeft: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
      },
      animation: {
        'draw-circle': 'drawCircle 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'draw-path': 'drawPath 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards',
        'gradient-border': 'gradientBorder 3s linear infinite',
        'fade-in': 'fadeIn 0.4s ease-in forwards',
        'fade-out': 'fadeOut 0.4s ease-in forwards',

        'slide-in-top': 'slideInTop 0.3s ease-in forwards',
        'slide-in-bottom': 'slideInBottom 0.3s ease-in forwards',
        'slide-in-left': 'slideInLeft 0.3s ease-in forwards',
        'slide-in-right': 'slideInRight 0.3s ease-in forwards',

        'slide-out-top': 'slideOutTop 0.3s ease-in forwards',
        'slide-out-bottom': 'slideOutBottom 0.3s ease-in forwards',
        'slide-out-left': 'slideOutLeft 0.3s ease-in forwards',
        'slide-out-right': 'slideOutRight 0.3s ease-in forwards',
        'text-up': 'textUp 8s ease-in-out infinite',
        'bounce-x': 'bounceX 3s infinite ease-in-out',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.stroke-dasharray-circle': {
          'stroke-dasharray': '251.3',
          'stroke-dashoffset': '251.3',
        },
        '.stroke-dasharray-path': {
          'stroke-dasharray': '60',
          'stroke-dashoffset': '60',
        },
      })
    },
  ],
}
