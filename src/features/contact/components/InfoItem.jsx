import { motion } from 'framer-motion';

/**
 * InfoItem
 * Animated contact information list item.
 * Pure presentational component.
 */
export const InfoItem = ({ icon: Icon, label, value, href, delay }) => (
  <motion.li
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.45, delay }}
    whileHover={{ x: 4 }}
    className="flex items-start gap-3"
  >
    <motion.div
      whileHover={{ scale: 1.2, rotate: 8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      className="mt-0.5"
    >
      <Icon className="text-blue-600" size={20} />
    </motion.div>
    <div>
      <p className="font-medium text-slate-700">{label}</p>
      <a className="text-slate-600 hover:text-blue-600 transition-colors" href={href}>
        {value}
      </a>
    </div>
  </motion.li>
);
