import { motion } from 'framer-motion';
import { FormField, Input, Button } from '@/shared/components/ui';

/**
 * SignupLayout
 * Pure presentational component for the signup page.
 * Receives all data and handlers via props — no business logic inside.
 */
export const SignupLayout = ({
  fields,
  errors,
  isLoading,
  passwordsMatch,
  setField,
  handleSubmit,
  onGoToLogin,
  onBackToHome: _onBackToHome,
}) => (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 py-6">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md sm:max-w-lg space-y-6 sm:space-y-8"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">Get started with Consolto today</p>
        </div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <FormField
              required
              autoComplete="name"
              error={!!errors.name}
              errorMessage={errors.name?.[0]}
              id="name"
              inputComponent={Input}
              label="Full name"
              name="name"
              placeholder="Full name"
              type="text"
              value={fields.name}
              onChange={setField('name')}
            />

            <FormField
              required
              autoComplete="email"
              error={!!errors.email}
              errorMessage={errors.email?.[0]}
              id="email"
              inputComponent={Input}
              label="Email address"
              name="email"
              placeholder="Email"
              type="email"
              value={fields.email}
              onChange={setField('email')}
            />

            <FormField
              required
              autoComplete="new-password"
              error={!!errors.password}
              errorMessage={errors.password?.[0]}
              id="password"
              inputComponent={Input}
              label="Password"
              minLength={6}
              name="password"
              placeholder="Password"
              type="password"
              value={fields.password}
              onChange={setField('password')}
            />

            <FormField
              required
              autoComplete="new-password"
              error={!!errors.confirmPassword || (fields.confirmPassword && !passwordsMatch)}
              errorMessage={
                errors.confirmPassword?.[0] ||
                (fields.confirmPassword && !passwordsMatch ? 'Passwords do not match' : '')
              }
              id="confirmPassword"
              inputComponent={Input}
              label="Confirm password"
              minLength={6}
              name="confirmPassword"
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

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              {onGoToLogin ? (
                <button
                  className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                  type="button"
                  onClick={onGoToLogin}
                >
                  Sign in
                </button>
              ) : null}
            </p>
          </div>
        </motion.div>


      </motion.div>
    </div>
  );
