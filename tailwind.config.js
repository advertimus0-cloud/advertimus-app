/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enforce Dark theme only behavior
  theme: {
    extend: {
      colors: {
        background: "#000000",
        accent1: "#5d1a1b",
        accent2: "#161142",
        text: {
          DEFAULT: "#FFFFFF",
          secondary: "#E0E0E0",
        },
        pinkAccent: {
          DEFAULT: '#ec4899', // Pink accents for buttons
          hover: '#db2777'
        }
      },
      textColor: {
        DEFAULT: "#FFFFFF",
        primary: "#FFFFFF",
        secondary: "#E0E0E0",
      },
      backgroundColor: {
        DEFAULT: "#000000",
        background: "#000000",
      },
      backgroundImage: {
        'gradient-border': 'linear-gradient(to right, #5d1a1b, #161142)',
        'gradient-hover': 'linear-gradient(to right, #161142, #5d1a1b)',
      },
      borderColor: {
        DEFAULT: "#5d1a1b",
        accent1: "#5d1a1b",
        accent2: "#161142",
      },
      spacing: {
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
        '64': '64px',
      },
      borderRadius: {
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
    },
  },
  plugins: [],
}
