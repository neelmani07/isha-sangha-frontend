import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm, earthy palette: parchment backgrounds, deep brown ink, vermilion for actions, gold accents
        ink: '#28231e',
        muted: '#6f6659',
        cream: '#f9f6f1',
        sand: '#ede6da',
        parchment: '#e4ded4',
        border: '#ddd3c3',
        // "saffron" is the action colour used across the app (buttons, links, highlights)
        saffron: '#cf4520',
        'saffron-light': '#fbece4',
        'saffron-dark': '#a8361a',
        gold: '#b8862b',
        'gold-light': '#f3e6c8',
        maroon: '#5e2614',
        'maroon-dark': '#3f190d',
        teal: '#0b4a63',
        'teal-dark': '#06303f',
        'teal-deep': '#041f29',
        'teal-light': '#e2efee',
        sage: '#7fb59a',
        // kept for map markers & secondary accents
        leaf: '#3d7a52',
        'leaf-light': '#4a9163',
        cloud: '#ffffff',
        ember: '#a8361a',
      },
      fontFamily: {
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        body: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        pill: '9999px',
      },
      boxShadow: {
        panel: '0 8px 40px rgba(40, 35, 30, 0.10)',
        card: '0 2px 14px rgba(40, 35, 30, 0.07)',
        'card-hover': '0 12px 32px rgba(40, 35, 30, 0.14)',
        glow: '0 0 32px rgba(207, 69, 32, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        twinkle: 'twinkle 4s ease-in-out infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(0.6)', filter: 'brightness(0.5)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
