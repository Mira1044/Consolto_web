import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useError } from './ErrorContext';

/**
 * Toast Notification Types
 */
export const ToastType = {
  ERROR: 'error',
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
};

/**
 * Get icon for toast type
 */
const getToastIcon = (type) => {
  switch (type) {
    case ToastType.SUCCESS:
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case ToastType.INFO:
      return <Info className="h-5 w-5 text-blue-600" />;
    case ToastType.WARNING:
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    case ToastType.ERROR:
    default:
      return <AlertCircle className="h-5 w-5 text-red-600" />;
  }
};

/**
 * Get background color for toast type
 */
const getToastBgColor = (type) => {
  switch (type) {
    case ToastType.SUCCESS:
      return 'bg-green-50 border-green-200';
    case ToastType.INFO:
      return 'bg-blue-50 border-blue-200';
    case ToastType.WARNING:
      return 'bg-yellow-50 border-yellow-200';
    case ToastType.ERROR:
    default:
      return 'bg-red-50 border-red-200';
  }
};

/**
 * Single Toast Component
 */
const Toast = ({ error, onClose }) => {
  const type = error.type || ToastType.ERROR;
  const message = error.error?.message || error.message || 'An error occurred';

  useEffect(() => {
    // Auto-close if duration is set
    if (error.duration && error.duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, error.duration);
      return () => clearTimeout(timer);
    }
  }, [error.duration, onClose]);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`rounded-lg border p-4 shadow-lg ${getToastBgColor(type)}`}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{getToastIcon(type)}</div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{message}</p>
          {error.error?.code && (
            <p className="mt-1 text-xs text-gray-500">Error Code: {error.error.code}</p>
          )}
        </div>
        <button
          aria-label="Close"
          className="flex-shrink-0 rounded p-1 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={onClose}
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

/**
 * Error Toast Container
 * Displays error toasts at the top of the screen
 */
export const ErrorToast = () => {
  const { errors, removeError, isErrorVisible } = useError();

  if (!isErrorVisible || errors.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-md w-full sm:w-auto">
      <AnimatePresence mode="popLayout">
        {errors.map((error) => (
          <Toast key={error.id} error={error} onClose={() => removeError(error.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};
