import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#f5f0e4', dark: '#e8e0d4' },
        ink: { DEFAULT: '#2a3a4a' },
        vermillion: { DEFAULT: '#c05a3a' },
        paper: { DEFAULT: '#faf8f3' },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Noto Serif JP', 'serif'],
      },
      animation: {
        'fly-out': 'flyOut 1s ease-in forwards',
        'land-in': 'landIn 0.8s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        flyOut: {
          '0%': { transform: 'translate(0,0) rotate(0) scale(1)', opacity: '1' },
          '50%': { transform: 'translate(150px,-60px) rotate(-10deg) scale(0.9)', opacity: '0.8' },
          '100%': { transform: 'translate(400px,-200px) rotate(-30deg) scale(0.3)', opacity: '0' },
        },
        landIn: {
          '0%': { transform: 'translate(-200px, -20px) rotate(-5deg)', opacity: '0' },
          '70%': { transform: 'translate(10px, 2px) rotate(1deg)', opacity: '1' },
          '100%': { transform: 'translate(0, 0) rotate(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
