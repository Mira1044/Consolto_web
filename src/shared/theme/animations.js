/**
 * Animation Utilities
 * Framer Motion animation presets and utilities
 */

import { transitions } from './tokens';

/**
 * Framer Motion animation variants
 * Ready-to-use animation configurations
 */
export const motionVariants = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: transitions.easing.out },
  },

  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3, ease: transitions.easing.out },
  },

  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: transitions.easing.out },
  },

  // Scale animations
  scaleIn: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
    transition: { duration: 0.2, ease: transitions.easing.out },
  },

  scaleOut: {
    initial: { scale: 1, opacity: 1 },
    animate: { scale: 0.95, opacity: 0 },
    exit: { scale: 1, opacity: 1 },
    transition: { duration: 0.2, ease: transitions.easing.out },
  },

  // Slide animations
  slideLeft: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
    transition: { duration: 0.3, ease: transitions.easing.out },
  },

  slideRight: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
    transition: { duration: 0.3, ease: transitions.easing.out },
  },

  // Stagger children animations
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: transitions.easing.out },
  },
};

/**
 * Transition presets
 */
export const motionTransitions = {
  fast: {
    duration: 0.15,
    ease: transitions.easing.out,
  },
  base: {
    duration: 0.2,
    ease: transitions.easing.out,
  },
  slow: {
    duration: 0.3,
    ease: transitions.easing.out,
  },
  slower: {
    duration: 0.5,
    ease: transitions.easing.out,
  },
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 25,
  },
  springBounce: {
    type: 'spring',
    stiffness: 300,
    damping: 20,
  },
};

/**
 * Hover animations
 */
export const hoverAnimations = {
  lift: {
    scale: 1.05,
    y: -4,
    transition: motionTransitions.base,
  },
  glow: {
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
    transition: motionTransitions.base,
  },
  shrink: {
    scale: 0.95,
    transition: motionTransitions.base,
  },
};

/**
 * Tap animations
 */
export const tapAnimations = {
  scale: {
    scale: 0.95,
    transition: motionTransitions.fast,
  },
};

/**
 * Helper function to create custom animation variants
 */
export const createAnimation = (config) => ({
    initial: config.initial || {},
    animate: config.animate || {},
    exit: config.exit || {},
    transition: config.transition || motionTransitions.base,
  });
