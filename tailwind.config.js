/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        midnight: '#0A0A0A',

        surface: '#111111',
        'surface-2': '#1A1A1A',

        glass: 'rgba(255,255,255,0.08)',
        'glass-border': 'rgba(255,255,255,0.12)',

        primary: '#00E5A8',
        teal: '#00E5A8',
        'teal-dim': 'rgba(0,229,168,0.12)',

        secondary: '#3B82F6',
        'blue-soft': '#3B82F6',

        amber: '#F59E0B',
        red: '#EF4444',

        'text-1': '#FFFFFF',
        'text-2': '#A1A1AA',
        'text-3': '#71717A',

        border: 'rgba(255,255,255,0.12)',
      },

      borderRadius: {
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '40px',
      },

      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.35)',
        soft: '0 4px 20px rgba(0,0,0,0.25)',
      },

      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
      },

      fontFamily: {
        inter: ['Inter_400Regular', 'Inter_500Medium', 'Inter_700Bold', 'Inter_800ExtraBold'],
        mono: ['JetBrainsMono_400Regular', 'JetBrainsMono_700Bold'],
      },
    },
  },
  plugins: [],
};
