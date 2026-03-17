import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { FormField, Input, Button } from '@/shared/components/ui';
import { useLogin } from '../hooks/useLogin';

/**
 * LoginForm
 * Modal login form component.
 * Uses the useLogin hook for state and submission — presentation only.
 */
export const LoginForm = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const { fields, errors, isLoading, setField, handleSubmit } = useLogin({
    onSuccess: () => {
      onClose();
      navigate('/experts');
    },
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Log in</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <FormField
                label="Email"
                id="login-email"
                type="email"
                value={fields.email}
                onChange={setField('email')}
                required
              placeholder="Email"
                inputComponent={Input}
                error={!!errors.email}
                errorMessage={errors.email?.[0]}
              />
              <div>
                <FormField
                  label="Password"
                  id="login-password"
                  type="password"
                  value={fields.password}
                  onChange={setField('password')}
                  required
              placeholder="Password"
                  inputComponent={Input}
                  error={!!errors.password}
                  errorMessage={errors.password?.[0]}
                />
                <a href="#" className="mt-2 block text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <Button type="submit" disabled={isLoading} isLoading={isLoading} fullWidth size="lg">
                {isLoading ? 'Logging in...' : 'Log in'}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
