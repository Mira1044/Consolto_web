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
  onForgotPassword: _onForgotPassword,
  onGoToSignup: _onGoToSignup,
  onBackToHome: _onBackToHome,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="w-full flex items-start md:items-center justify-center px-2 sm:px-4 pt-4 pb-6 sm:pt-6 sm:pb-8">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md sm:max-w-lg space-y-5 sm:space-y-7"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">Welcome back</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">Sign in to your account to continue</p>
        </div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <form noValidate className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
            <FormField
              autoComplete="email"
              error={!!errors.email}
              errorMessage={errors.email?.[0]}
              id="email"
              inputComponent={Input}
              label={
                <>
                  Email address <span className="text-red-500">*</span>
                </>
              }
              name="email"
              placeholder="Email"
              type="text"
              value={fields.email}
              onChange={setField('email')}
            />

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="relative">
                <Input
                  required
                  autoComplete="current-password"
                  className="pr-12"
                  error={!!errors.password}
                  id="password"
                  name="password"
                  placeholder="••••••••"
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
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </motion.div>


      </motion.div>
    </div>
  );
};
