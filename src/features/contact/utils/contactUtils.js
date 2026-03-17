/**
 * Contact utility functions
 * Pure functions for contact-related presentation helpers.
 */

/**
 * Framer Motion stagger container variant.
 */
export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

/**
 * Framer Motion item variant (slide-up + fade).
 */
export const staggerItem = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 24 },
  },
};

/**
 * Contact information entries.
 * Centralised so the layout component receives pure data.
 */
export const CONTACT_INFO = [
  {
    id: 'email',
    iconName: 'Mail',
    label: 'Email',
    value: 'contact@consolto.in',
    href: 'mailto:contact@consolto.in',
  },
  {
    id: 'phone',
    iconName: 'Phone',
    label: 'Phone',
    value: '+91 9689873927',
    href: 'tel:+919689873927',
  },
  {
    id: 'address',
    iconName: 'MapPin',
    label: 'Address',
    value: '123 Business Ave, Suite 100, SF CA 94107',
    href: '#',
  },
];
