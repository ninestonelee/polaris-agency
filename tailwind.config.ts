import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      colors: {
        polaris: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#bae0ff',
          300: '#7cc6ff',
          400: '#36a9ff',
          500: '#0a8ef7',
          600: '#0072d4',
          700: '#005baa',
          800: '#024d8c',
          900: '#053f73',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
