/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0F172A',
        surface: '#111827',
        panel: '#1F2937',
        border: '#334155',

        textPrimary: '#E5E7EB',
        textSecondary: '#9CA3AF',
        textMuted: '#6B7280',

        riskLow: '#4B7F52',
        riskMedium: '#8A6A2F',
        riskHigh: '#7A3B3B',
        riskUncertain: '#475569',

        accent: '#64748B',
      },
      keyframes: {
        "pulse-slow": {
          '0%, 100%': {
            transform: 'translateX(-100%)',
          },
          '50%': {
            transform: 'translateX(100%)',
          },
        },
      },
      animation: {
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
