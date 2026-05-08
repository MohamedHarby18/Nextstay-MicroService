/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand
        brand: { 50: '#fff1f2', 100: '#ffe4e6', 500: '#FF385C', 600: '#e8314f', 700: '#c01f3b' },
        // Guest - warm coral
        guest: { 50: '#fff7f0', 100: '#ffe8d6', 500: '#FF5A5F', 600: '#e84e53', 700: '#c73d42', accent: '#FC642D' },
        // Host - navy/teal
        host: { 50: '#f0f7fb', 100: '#d6eaf8', 500: '#1B4F72', 600: '#174260', 700: '#12344e', accent: '#2E86AB' },
        // Support Agent - forest/mint
        agent: { 50: '#f0f7f4', 100: '#d6ede3', 500: '#2D6A4F', 600: '#255c44', 700: '#1e4d39', accent: '#52B788' },
        // Users Admin - midnight/red
        usersAdmin: { 50: '#f5f5f8', 100: '#e8e8f0', 500: '#1A1A2E', 600: '#161627', 700: '#111120', accent: '#E94560' },
        // Employees Admin - slate/amber
        empAdmin: { 50: '#f7f8fa', 100: '#eef0f3', 500: '#2C3E50', 600: '#253545', 700: '#1e2c3a', accent: '#F39C12' },
        // Neutrals
        surface: '#FFFFFF',
        muted: '#F7F7F7',
        border: '#E8E8E8',
        text: { primary: '#222222', secondary: '#717171', light: '#B0B0B0' },
      },
      boxShadow: {
        card: '0 2px 16px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 24px rgba(0,0,0,0.14)',
        'nav': '0 1px 0 rgba(0,0,0,0.08)',
        'modal': '0 20px 60px rgba(0,0,0,0.18)',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
