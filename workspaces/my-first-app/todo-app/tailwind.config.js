/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'Noto Sans JP', 'sans-serif'],
      },
      colors: {
        neon: {
          green:  '#39FF14',
          yellow: '#FFE135',
          red:    '#FF3131',
        },
        dark: {
          base:   '#1a1a1a',
          card:   '#2a2a2a',
          item:   '#333333',
          border: '#3a3a3a',
          muted:  '#555555',
        },
      },
    },
  },
  plugins: [],
}
