import { Input } from './Input';
import { Textarea } from './Textarea';

/**
 * FormField Component
 * Wrapper component that combines label, input/textarea, and error message
 */
export const FormField = ({
  label,
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
  error,
  errorMessage,
  helperText,
  labelClassName = '',
  inputComponent: InputComponent,
  multiline = false,
  rows,
  children,
  ...props
}) => {
  // If children provided, render them (for custom inputs)
  if (children) {
    return (
      <div>
        {label && (
          <label
            className={`block text-sm font-medium text-gray-700 mb-2 ${labelClassName}`}
            htmlFor={id}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {children}
        {error && errorMessage && (
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
        )}
        {!error && helperText && <p className="mt-2 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }

  // Determine which component to use
  let Component = InputComponent || Input;
  if (multiline) {
    Component = Textarea;
  }

  return (
    <div>
      {label && (
        <label
          className={`block text-sm font-medium text-gray-700 mb-2 ${labelClassName}`}
          htmlFor={id}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Component
        autoComplete={autoComplete}
        disabled={disabled}
        error={error}
        id={id}
        maxLength={maxLength}
        minLength={minLength}
        name={name}
        placeholder={placeholder}
        required={required}
        rows={rows}
        type={type}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        {...props}
      />
      {error && errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
      {!error && helperText && <p className="mt-2 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};
