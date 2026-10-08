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
        background: {
          DEFAULT: '#0A0A1A',
          darker: '#060612',
          card: '#12122B',
          cardLight: '#1A1A3A',
          border: '#23234A',
        },
        ghazara: {
          purple: '#6B21C8',
          purpleLight: '#8B5CF6',
          purpleDark: '#4C1D95',
          purpleGlow: 'rgba(107, 33, 200, 0.25)',
          orange: '#FF6B2B',
          orangeHover: '#EA580C',
          orangeLight: '#FFA07A',
          orangeGlow: 'rgba(255, 107, 43, 0.3)',
          emerald: '#10B981',
          cyan: '#06B6D4',
          amber: '#F59E0B',
          rose: '#F43F5E',
        },
        surface: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        }
      },
      fontFamily: {
        cairo: ['Cairo', 'Tajawal', 'sans-serif'],
        tajawal: ['Tajawal', 'Cairo', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(107, 33, 200, 0.4)',
        'glow-orange': '0 0 25px -5px rgba(255, 107, 43, 0.4)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
