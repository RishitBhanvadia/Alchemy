/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lab-black': '#080810',
        'lab-card': '#0f0f1a',
        'lab-input': '#13131f',
        'lab-purple': '#7c3aed',
        'lab-purple-soft': '#a78bfa',
        'lab-cyan': '#06b6d4',
        'lab-muted': '#6b7280',
        'lab-placeholder': '#374151',
      },
      backgroundImage: {
        'ion-gradient': 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #06b6d4 100%)',
        'logo-gradient': 'linear-gradient(to bottom right, #7c3aed, #06b6d4)',
      },
      boxShadow: {
        'lab-card': '0 0 0 1px rgba(99,58,255,0.15), 0 20px 60px rgba(0,0,0,0.6), 0 0 80px rgba(99,58,255,0.08) inset',
        'lab-button': '0 4px 20px rgba(124,58,237,0.5), 0 1px 0 rgba(255,255,255,0.1) inset',
        'lab-button-hover': '0 8px 30px rgba(124,58,237,0.7)',
        'lab-input-focus': '0 0 0 3px rgba(124,58,237,0.15), 0 0 20px rgba(124,58,237,0.1)',
        'lab-role-selected': '0 0 20px rgba(124,58,237,0.2), 0 0 0 1px rgba(124,58,237,0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
