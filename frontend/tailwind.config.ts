import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/presentation/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        purple: {
          brand: '#6C3FCF',
          light: '#9B6DFF',
          pale: '#C4A8FF',
          tint: '#F3EFFF',
        },
        dark: '#0D0520',
      },
    },
  },
  plugins: [],
};

export default config;
