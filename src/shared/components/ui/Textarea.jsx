import { forwardRef } from 'react';

/**
 * Textarea Component
 * Reusable textarea component with consistent styling
 */
export const Textarea = forwardRef(
  (
    {
      id,
      name,
      value,
      onChange,
      onBlur,
      placeholder,
      required = false,
      disabled = false,
      rows = 4,
      maxLength,
      className = '',
      error = false,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'w-full resize-none rounded-xl border px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors';
    const stateClasses = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20';
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : '';

    return (
      <textarea
        ref={ref}
        className={`${baseClasses} ${stateClasses} ${disabledClasses} ${className}`}
        disabled={disabled}
        id={id}
        maxLength={maxLength}
        name={name}
        placeholder={placeholder}
        required={required}
        rows={rows}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
