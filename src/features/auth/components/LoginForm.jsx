import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, X } from 'lucide-react';
import { useState } from 'react';
import { FormField, Input, Button } from '@/shared/components/ui';
import { useLogin } from '../hooks/useLogin';

/**
 * LoginForm
 * Modal login form component.
 * Uses the useLogin hook for state and submission — presentation only.
 */
export const LoginForm = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-2xl"
            exit={{ opacity: 0, scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Log in</h2>
              <button
                aria-label="Close"
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                type="button"
                onClick={onClose}
              >
                <X size={24} />
              </button>
            </div>
            <form noValidate className="space-y-5" onSubmit={handleSubmit}>
              <FormField
                error={!!errors.email}
                errorMessage={errors.email?.[0]}
                id="login-email"
                inputComponent={Input}
                label="Email"
              placeholder="Email"
                type="text"
                value={fields.email}
                onChange={setField('email')}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="login-password">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    required
                    className="pr-12"
                    error={!!errors.password}
                    id="login-password"
                    name="password"
                    placeholder="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={fields.password}
                    onChange={setField('password')}
                  />
                  <button
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password?.[0] ? <p className="mt-1 text-sm text-red-500">{errors.password[0]}</p> : null}
              </div>
              <Button fullWidth disabled={isLoading} isLoading={isLoading} size="lg" type="submit">
                {isLoading ? 'Logging in...' : 'Log in'}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
