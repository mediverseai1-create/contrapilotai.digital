import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        'ink-mute': 'var(--ink-mute)',
        vellum: 'var(--vellum)',
        'vellum-soft': 'var(--vellum-soft)',
        'vellum-warm': 'var(--vellum-warm)',
        page: 'var(--page)',
        aubergine: 'var(--aubergine)',
        redline: 'var(--redline)',
        highlighter: 'var(--highlighter)',
        sage: 'var(--sage)',
        rule: 'var(--rule)',
        'rule-soft': 'var(--rule-soft)',
      },
      fontFamily: {
        serif: ['var(--serif)'],
        sans: ['var(--sans)'],
        mono: ['var(--mono)'],
      },
    },
  },
  plugins: [],
};

export default config;
