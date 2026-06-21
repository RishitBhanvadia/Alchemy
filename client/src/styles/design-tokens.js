/* eslint-disable react/prop-types */
/* eslint-disable no-console */
export const colors = {
  background: '#080810',
  card: '#0f0f1a',
  input: '#13131f',
  purple: {
    DEFAULT: '#7c3aed',
    soft: '#a78bfa',
    glow: 'rgba(124, 58, 237, 0.6)',
    glowSoft: 'rgba(124, 58, 237, 0.15)',
  },
  cyan: {
    DEFAULT: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.4)',
  },
  text: {
    primary: '#ffffff',
    secondary: '#a78bfa',
    muted: '#6b7280',
    placeholder: '#374151',
    label: '#6b7280',
  },
  border: {
    card: 'rgba(255, 255, 255, 0.07)',
    input: 'rgba(255, 255, 255, 0.08)',
  }
};

export const shadows = {
  card: '0 0 0 1px rgba(99,58,255,0.15), 0 20px 60px rgba(0,0,0,0.6), 0 0 80px rgba(99,58,255,0.08) inset',
  button: '0 4px 20px rgba(124,58,237,0.5), 0 1px 0 rgba(255,255,255,0.1) inset',
  buttonHover: '0 8px 30px rgba(124,58,237,0.7)',
  inputFocus: '0 0 0 3px rgba(124,58,237,0.15), 0 0 20px rgba(124,58,237,0.1)',
};

export const gradients = {
  primary: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #06b6d4 100%)',
  logo: 'linear-gradient(to bottom right, #7c3aed, #06b6d4)',
  nebulaPurple: 'rgba(99, 58, 255, 0.12)',
  nebulaCyan: 'rgba(0, 200, 255, 0.07)',
};
