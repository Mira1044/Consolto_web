import { Loader2 } from 'lucide-react';

/**
 * Loader Component
 * Reusable loading spinner component
 */
export const Loader = ({
  size = 'md',
  color = 'primary',
  className = '',
  fullScreen = false,
  text = null,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    white: 'text-white',
    gray: 'text-gray-600',
  };

  const spinner = (
    <div className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : ''} ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <Loader2
          className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        />
        {text && (
          <p className={`text-sm ${colorClasses[color]}`}>{text}</p>
        )}
      </div>
    </div>
  );

  return spinner;
};

/**
 * Inline Loader
 * Small inline loading spinner
 */
export const InlineLoader = ({ size = 'sm', color = 'primary', className = '' }) => <Loader className={className} color={color} size={size} />;

/**
 * Button Loader
 * Loading spinner for buttons
 */
export const ButtonLoader = ({ size = 'sm', color = 'white', className = '' }) => <Loader className={className} color={color} size={size} />;
