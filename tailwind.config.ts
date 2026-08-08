import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        goldLight: '#F5C542',
        bgblack: '#0a0a0a'
      },
      backdropBlur: { xs: '2px' }
    }
  },
  plugins: []
};
export default config;
