import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        zen: {
          bg: '#f8f5f0',
          'bg-night': '#1a1d24',
          amber: '#d4883a',
          teal: '#2a6b5a',
          text: '#1a1d24',
          'text-night': '#f0ebe0',
          card: '#ffffff',
          'card-night': '#252830',
          border: '#eae5dc',
          'border-night': '#333840',
          vermillion: '#c05a3a',
          paper: '#fdfcf9',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Noto Serif JP', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'zen': '0 2px 16px rgba(26, 29, 36, 0.06)',
        'zen-md': '0 4px 24px rgba(26, 29, 36, 0.08)',
        'zen-lg': '0 8px 40px rgba(26, 29, 36, 0.12)',
        'zen-glow': '0 4px 24px rgba(212, 136, 58, 0.15)',
        'zen-night': '0 2px 16px rgba(0, 0, 0, 0.3)',
        'zen-night-md': '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'fly-out': 'flyOut 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'land-in': 'landIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'fold': 'fold 0.6s ease-in-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        flyOut: {
          '0%': { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: '1' },
          '30%': { transform: 'translate(100px, -40px) rotate(-10deg) scale(1.1)', opacity: '1' },
          '70%': { transform: 'translate(60vw, -30vh) rotate(-25deg) scale(0.8)', opacity: '0.7' },
          '100%': { transform: 'translate(100vw, -50vh) rotate(-35deg) scale(0.4)', opacity: '0' },
        },
        landIn: {
          '0%': { transform: 'translate(200px, -100px) rotate(-20deg) scale(0.6)', opacity: '0' },
          '50%': { transform: 'translate(-10px, 5px) rotate(3deg) scale(1.05)', opacity: '1' },
          '70%': { transform: 'translate(5px, -2px) rotate(-1deg) scale(0.98)', opacity: '1' },
          '100%': { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: '1' },
        },
        fold: {
          '0%': { transform: 'perspective(800px) rotateY(0deg)' },
          '50%': { transform: 'perspective(800px) rotateY(90deg)' },
          '100%': { transform: 'perspective(800px) rotateY(0deg) scale(0.8)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 136, 58, 0.1)' },
          '50%': { boxShadow: '0 0 30px rgba(212, 136, 58, 0.25)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
