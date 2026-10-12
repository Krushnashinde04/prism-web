/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        prism: {
          bg: '#07080f',
          surface: '#0d0f1d',
          card: '#121528',
          cardHover: '#181c35',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(168, 85, 247, 0.35)',
          violet: '#8b5cf6',
          purple: '#a855f7',
          cyan: '#06b6d4',
          blue: '#3b82f6',
          pink: '#ec4899',
          amber: '#f59e0b',
          emerald: '#10b981',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-violet': '0 0 25px -5px rgba(139, 92, 246, 0.45)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.45)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.45)',
        'glow-pink': '0 0 25px -5px rgba(236, 72, 153, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(135deg, #07080f 0%, #0d0f22 50%, #130d29 100%)',
        'prism-glow': 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.18) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 80%)',
        'accent-gradient': 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #06b6d4 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
