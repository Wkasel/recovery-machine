/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Vercel-style minimal design system
      colors: {
        // Force Vercel dark theme colors
        background: '#000000',
        foreground: '#ffffff',
        card: '#111111',
        'card-foreground': '#ffffff',
        popover: '#111111',
        'popover-foreground': '#ffffff',
        primary: '#ffffff',
        'primary-foreground': '#000000',
        secondary: '#262626',
        'secondary-foreground': '#ffffff',
        muted: '#262626',
        'muted-foreground': '#a3a3a3',
        accent: '#262626',
        'accent-foreground': '#ffffff',
        destructive: '#ef4444',
        'destructive-foreground': '#ffffff',
        border: '#262626',
        input: '#111111',
        ring: '#ffffff',
        
        // Vercel minimal palette
        'vercel-black': '#000000',
        'vercel-white': '#ffffff',
        'vercel-gray': '#737373',
      },
      // Force all border radius to 0 - Sharp edges everywhere
      borderRadius: {
        'none': '0',
        'sm': '0',
        'md': '0',
        'lg': '0',
        'xl': '0',
        '2xl': '0',
        '3xl': '0',
        'full': '0',
      },
      // Minimal typography using system fonts
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
      },
      // Remove all animations
      animation: {
        'none': 'none',
        'spin': 'none',
        'ping': 'none',
        'pulse': 'none',
        'bounce': 'none',
      },
      // Minimal spacing following 8px grid
      spacing: {
        '0': '0',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '32': '8rem',
        '40': '10rem',
        '48': '12rem',
        '56': '14rem',
        '64': '16rem',
      },
      // Geometric grid system
      gridTemplateColumns: {
        'vercel': 'repeat(auto-fit, minmax(300px, 1fr))',
      },
    },
  },
  plugins: [],
  // Override any potential rounded corners globally
  corePlugins: {
    borderRadius: false,
  },
}