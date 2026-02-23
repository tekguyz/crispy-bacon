/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Newsreader', 'serif'],
        display: ['Newsreader', 'serif'],
        slab: ['Newsreader', 'serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      colors: {
        background: 'oklch(var(--color-background))',
        'on-background': 'oklch(var(--color-on-background))',
        surface: 'oklch(var(--color-surface))',
        'on-surface': 'oklch(var(--color-on-surface))',
        primary: 'oklch(var(--color-primary))',
        'on-primary': 'oklch(var(--color-on-primary))',
        secondary: 'oklch(var(--color-secondary))',
        'on-secondary': 'oklch(var(--color-on-secondary))',
        error: 'oklch(var(--color-error))',
        'on-error': 'oklch(var(--color-on-error))',
        'surface-variant': 'oklch(var(--color-surface-variant))',
        'on-surface-variant': 'oklch(var(--color-on-surface-variant))',
        outline: 'oklch(var(--color-outline) / var(--color-outline-opacity))',
        'surface-container-lowest': 'oklch(var(--color-surface-container-lowest))',
        'surface-container-low': 'oklch(var(--color-surface-container-low))',
        'surface-container': 'oklch(var(--color-surface-container))',
        'surface-container-high': 'oklch(var(--color-surface-container-high))',
        'surface-container-highest': 'oklch(var(--color-surface-container-highest))',
        card: 'oklch(var(--color-surface-container-low))',
        'card-foreground': 'oklch(var(--color-on-surface))',
      },
      borderRadius: {
        'expressive': '1.25rem',
        'sheet': '2.5rem',
        '4xl': '2rem',
      }
    }
  },
  plugins: [],
}
