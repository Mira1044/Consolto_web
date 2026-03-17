import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { FormField, Input, Button } from '@/shared/components/ui';
import { useSignup } from '../hooks/useSignup';

/**
 * SignupForm
 * Modal signup form component.
 * Uses the useSignup hook for state and submission — presentation only.
 */
export const SignupForm = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const { fields, errors, isLoading, passwordsMatch, setField, handleSubmit } = useSignup({
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
            className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Sign up</h2>
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
                label="Name"
                id="signup-name"
                type="text"
                value={fields.name}
                onChange={setField('name')}
                required
                placeholder="Your name"
                inputComponent={Input}
                error={!!errors.name}
                errorMessage={errors.name?.[0]}
              />
              <FormField
                label="Email"
                id="signup-email"
                type="email"
                value={fields.email}
                onChange={setField('email')}
                required
                placeholder="you@example.com"
                inputComponent={Input}
                error={!!errors.email}
                errorMessage={errors.email?.[0]}
              />
              <FormField
                label="Password"
                id="signup-password"
                type="password"
                value={fields.password}
                onChange={setField('password')}
                required
                minLength={6}
                placeholder="••••••••"
                inputComponent={Input}
                error={!!errors.password}
                errorMessage={errors.password?.[0]}
              />
              <FormField
                label="Confirm password"
                id="signup-confirm"
                type="password"
                value={fields.confirmPassword}
                onChange={setField('confirmPassword')}
                required
                minLength={6}
                placeholder="••••••••"
                inputComponent={Input}
                error={!!errors.confirmPassword || (fields.confirmPassword && !passwordsMatch)}
                errorMessage={
                  errors.confirmPassword?.[0] ||
                  (fields.confirmPassword && !passwordsMatch ? 'Passwords do not match' : '')
                }
              />
              <Button
                type="submit"
                disabled={isLoading || !passwordsMatch}
                isLoading={isLoading}
                fullWidth
                size="lg"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
