/**
 * Layout Utilities
 * Common layout components and utilities
 */

import { layout, spacing, breakpoints } from './tokens';

/**
 * Container component props
 */
export const containerProps = {
  sm: {
    className: 'max-w-screen-sm mx-auto px-4',
  },
  md: {
    className: 'max-w-screen-md mx-auto px-4',
  },
  lg: {
    className: 'max-w-screen-lg mx-auto px-4',
  },
  xl: {
    className: 'max-w-screen-xl mx-auto px-4',
  },
  '2xl': {
    className: 'max-w-screen-2xl mx-auto px-4',
  },
  full: {
    className: 'w-full px-4',
  },
};

/**
 * Section spacing presets
 */
export const sectionSpacing = {
  none: 'py-0',
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-24',
  xl: 'py-24 md:py-32',
};

/**
 * Content spacing presets
 */
export const contentSpacing = {
  none: 'space-y-0',
  sm: 'space-y-4',
  md: 'space-y-6',
  lg: 'space-y-8',
  xl: 'space-y-12',
};

/**
 * Grid presets
 */
export const gridPresets = {
  '1-col': 'grid grid-cols-1',
  '2-col': 'grid grid-cols-1 md:grid-cols-2',
  '3-col': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  '4-col': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  'auto-fit': 'grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]',
  'auto-fill': 'grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))]',
};

/**
 * Flex presets
 */
export const flexPresets = {
  row: 'flex flex-row',
  col: 'flex flex-col',
  'row-center': 'flex flex-row items-center justify-center',
  'col-center': 'flex flex-col items-center justify-center',
  'row-between': 'flex flex-row items-center justify-between',
  'col-between': 'flex flex-col items-center justify-between',
  'row-start': 'flex flex-row items-center justify-start',
  'row-end': 'flex flex-row items-center justify-end',
};

/**
 * Common layout classes
 */
export const layoutClasses = {
  container: 'max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8',
  containerFull: 'w-full px-4 sm:px-6 lg:px-8',
  section: 'py-12 md:py-16 lg:py-20',
  sectionSm: 'py-8 md:py-12',
  sectionLg: 'py-16 md:py-24 lg:py-32',
  content: 'space-y-6',
  contentLg: 'space-y-8',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  grid2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  grid4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
};
