import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * FloatField
 * Animated float-label input / textarea field.
 * Pure presentational component.
 */
export const FloatField = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  multiline,
  error,
}) => {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;
  const Tag = multiline ? 'textarea' : 'input';

  return (
    <div className="relative">
      <Tag
        id={id}
        type={type}
        required={required}
        value={value}
        placeholder={lifted ? placeholder : ' '}
        rows={multiline ? 6 : undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={onChange}
        className={`peer w-full rounded-xl border px-4 pt-6 pb-3 text-base text-slate-800 focus:outline-none focus:ring-2 resize-none transition-all duration-200 ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
        }`}
      />
      <motion.label
        htmlFor={id}
        animate={{
          top: lifted ? '6px' : '14px',
          fontSize: lifted ? '0.68rem' : '0.875rem',
          color: error ? '#ef4444' : focused ? '#2563eb' : '#94a3b8',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="absolute left-4 pointer-events-none font-medium"
        style={{ top: '14px', fontSize: '0.875rem', color: '#94a3b8' }}
      >
        {label}
      </motion.label>
      {error && (
        <p className="mt-1 text-sm text-red-500">{Array.isArray(error) ? error[0] : error}</p>
      )}
    </div>
  );
};
