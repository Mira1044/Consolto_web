import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { FormField, Input, Button } from '@/shared/components/ui';

/**
 * LoginLayout
 * Pure presentational component for the login page.
 * Receives all data and handlers via props — no business logic inside.
 */
export const LoginLayout = ({
  fields,
  errors,
  isLoading,
  setField,
  handleSubmit,
  onForgotPassword,
  onGoToSignup,
  onBackToHome,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] w-full flex items-center justify-center px-4 py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg space-y-6 sm:space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">Welcome back</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">Sign in to your account to continue</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <FormField
              label="Email address"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={fields.email}
              onChange={setField('email')}
              placeholder="Email"
              inputComponent={Input}
              error={!!errors.email}
              errorMessage={errors.email?.[0]}
            />

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                {/* {onForgotPassword ? (
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
                  >
                    Forgot password?
                  </button>
                ) : null} */}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={fields.password}
                  onChange={setField('password')}
                  placeholder="••••••••"
                  className="pr-12"
                  error={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password?.[0] ? <p className="mt-1 text-sm text-red-500">{errors.password[0]}</p> : null}
            </div>

            <Button type="submit" disabled={isLoading} isLoading={isLoading} fullWidth size="lg">
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              {onGoToSignup ? (
                <button
                  type="button"
                  onClick={onGoToSignup}
                  className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                >
                  Sign up
                </button>
              ) : null}
            </p>
          </div> */}
        </motion.div>

        
      </motion.div>
    </div>
  );
};
