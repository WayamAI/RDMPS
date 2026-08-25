/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Michroma', 'sans-serif'],
        michroma: ['Michroma', 'sans-serif'],
        sans: ['Geist', 'sans-serif'],
        mono: ['Geist', 'monospace'],
      },
      colors: {
        // ---- IMCC-exact Light Palette Tokens ----
        page: '#F7F7F8',
        container: '#FFFFFF',
        raised: '#F2F2F3',
        'raised-2': '#E7E7E9',
        'surface-action': '#F2F2F3',

        // ---- Stroke Tokens ----
        'stroke-default': 'rgba(9, 9, 11, 0.12)',
        'stroke-active': 'rgba(9, 9, 11, 0.24)',
        'stroke-muted': 'rgba(9, 9, 11, 0.07)',
        'stroke-disabled': 'rgba(9, 9, 11, 0.04)',

        // ---- Text Hierarchy ----
        'text-primary': '#0A0A0A',
        'text-secondary': '#3F3F46',
        'text-tertiary': '#71717A',
        'text-quaternary': '#A1A1AA',

        // ---- Hint & Auxiliary ----
        'hint-text': '#3F3F46',
        'hint-muted': '#71717A',
        'hint-dim': '#A1A1AA',

        // ---- Diagram Palette (light board) ----
        // Board sits above the page, bands recede below the board, cards above the bands.
        paper: '#FFFFFF',
        board: '#FFFFFF',
        band: '#F4F4F6',
        'band-border': '#E4E4E7',
        ink: '#0A0A0A',
        'ink-soft': '#52525B',
        'ink-faint': '#8B8B94',
        'flow-required': '#EA580C',
        'flow-required-soft': '#FB923C',
        'flow-required-bg': '#FFF7ED',
        // accent text on its own light tint needs more depth than the line colour gives
        'flow-required-bright': '#C2410C',
        'flow-all': '#2563EB',
        'flow-all-soft': '#60A5FA',
        // tint chips: the -50 shades
        'tint-all': '#EFF6FF',
        'tint-alert': '#FEF2F2',
        'tint-amber': '#FFFBEB',
        alert: '#DC2626',
        ok: '#15803D',
        navy: '#F1F5F9',
        'code-bg': '#F7F7F8',
        'code-green': '#15803D',
        amber: '#B45309',

        // ---- ShadCN Tokens ----
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}