/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
import twColors from 'tailwindcss/colors';

const deprecated = new Set(['lightBlue', 'warmGray', 'trueGray', 'coolGray', 'blueGray']);
const defaultColors = {};
for (const key of Object.keys(twColors)) {
  if (!deprecated.has(key)) {
    defaultColors[key] = twColors[key];
  }
}
import { colors, typography, spacing, borderRadius, shadows, breakpoints, zIndex, transitions, layout } from './src/shared/theme/tokens.js';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      // Inherit Tailwind defaults so bg-white, text-slate-900, etc. keep working
      ...defaultColors,
      // Layer custom design-token colors on top
      ...colors,
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
      success: colors.success,
      warning: colors.warning,
      error: colors.error,
      info: colors.info,
      gray: colors.gray,
      background: colors.background,
      text: colors.text,
      border: colors.border,
      transparent: 'transparent',
      current: 'currentColor',
    },
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    letterSpacing: typography.letterSpacing,
    spacing: spacing,
    borderRadius: borderRadius,
    boxShadow: shadows,
    screens: breakpoints,
    zIndex: zIndex,
    transitionDuration: transitions.duration,
    transitionTimingFunction: transitions.easing,
    extend: {
      height: {
        header: layout.header.height,
        'header-mobile': layout.header.heightMobile,
        sidebar: layout.sidebar.width,
        'sidebar-collapsed': layout.sidebar.widthCollapsed,
        footer: layout.footer.minHeight,
      },
      width: {
        sidebar: layout.sidebar.width,
        'sidebar-collapsed': layout.sidebar.widthCollapsed,
      },
      maxWidth: layout.container,
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        fadeOut: 'fadeOut 0.2s ease-out',
        slideUp: 'slideUp 0.3s ease-out',
        slideDown: 'slideDown 0.3s ease-out',
        scaleIn: 'scaleIn 0.2s ease-out',
        scaleOut: 'scaleOut 0.2s ease-out',
        blob: 'blob 7s infinite',
      },
    },
  },
  plugins: [],
};
