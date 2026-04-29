import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050508',
        surface: '#0f0f14',
        'surface-elevated': '#181820',
        'accent-cyan': '#00f0ff',
        'accent-magenta': '#ff006e',
        'accent-gold': '#ffbe0b',
        'text-primary': '#e8e8ec',
        'text-secondary': '#8b8b9a',
        'text-ghost': '#4a4a5a',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,240,255,0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(0,240,255,0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
} satisfies Config
