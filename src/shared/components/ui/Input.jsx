import { forwardRef } from 'react';

/**
 * Input Component
 * Reusable input field component with consistent styling
 */
export const Input = forwardRef(
  (
    {
      id,
      name,
      type = 'text',
      value,
      onChange,
      onBlur,
      placeholder,
      required = false,
      disabled = false,
      autoComplete,
      minLength,
      maxLength,
      className = '',
      error = false,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'w-full rounded-xl border px-4 py-3.5 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors';
    const stateClasses = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20';
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : '';

    return (
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        minLength={minLength}
        maxLength={maxLength}
        className={`${baseClasses} ${stateClasses} ${disabledClasses} ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
