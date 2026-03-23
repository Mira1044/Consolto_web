/**
 * Tailwind Theme Configuration
 * Maps design tokens to Tailwind CSS theme
 */

import { colors, typography, spacing, borderRadius, shadows, breakpoints, zIndex, transitions, layout } from './tokens';

/**
 * Tailwind theme configuration
 * This is imported and merged into the main tailwind.config.js
 */
const themeConfig = {
  colors: {
    ...colors,
    // Map semantic colors for easier use
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
    // Transparent
    transparent: 'transparent',
    current: 'currentColor',
  },
  fontFamily: typography.fontFamily,
  fontSize: typography.fontSize,
  fontWeight: typography.fontWeight,
  letterSpacing: typography.letterSpacing,
  spacing,
  borderRadius,
  boxShadow: shadows,
  screens: breakpoints,
  zIndex,
  transitionDuration: transitions.duration,
  transitionTimingFunction: transitions.easing,
  extend: {
    // Layout values
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
    // Animation keyframes
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
    // Animation utilities
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
};

export default themeConfig;
