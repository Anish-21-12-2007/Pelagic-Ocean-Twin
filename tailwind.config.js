/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        abyss: '#03060A',
        bone: '#F2F5F8',
        slateMuted: '#788492',
        pelagic: '#22D3EE',
        convergence: '#F59E0B',
        cleared: '#10B981',
      },
      opacity: {
        12: '0.12',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderColor: {
        hairline: 'rgba(255, 255, 255, 0.12)',
      },
    },
  },
  plugins: [],
};
