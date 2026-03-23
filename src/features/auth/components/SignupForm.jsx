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
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            exit={{ opacity: 0, scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Sign up</h2>
              <button
                aria-label="Close"
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                type="button"
                onClick={onClose}
              >
                <X size={24} />
              </button>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <FormField
                required
                error={!!errors.name}
                errorMessage={errors.name?.[0]}
                id="signup-name"
                inputComponent={Input}
                label="Name"
                placeholder="Full name"
                type="text"
                value={fields.name}
                onChange={setField('name')}
              />
              <FormField
                required
                error={!!errors.email}
                errorMessage={errors.email?.[0]}
                id="signup-email"
                inputComponent={Input}
                label="Email"
                placeholder="Email"
                type="email"
                value={fields.email}
                onChange={setField('email')}
              />
              <FormField
                required
                error={!!errors.password}
                errorMessage={errors.password?.[0]}
                id="signup-password"
                inputComponent={Input}
                label="Password"
                minLength={6}
                placeholder="Password"
                type="password"
                value={fields.password}
                onChange={setField('password')}
              />
              <FormField
                required
                error={!!errors.confirmPassword || (fields.confirmPassword && !passwordsMatch)}
                errorMessage={
                  errors.confirmPassword?.[0] ||
                  (fields.confirmPassword && !passwordsMatch ? 'Passwords do not match' : '')
                }
                id="signup-confirm"
                inputComponent={Input}
                label="Confirm password"
                minLength={6}
                placeholder="Confirm password"
                type="password"
                value={fields.confirmPassword}
                onChange={setField('confirmPassword')}
              />
              <Button
                fullWidth
                disabled={isLoading || !passwordsMatch}
                isLoading={isLoading}
                size="lg"
                type="submit"
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
