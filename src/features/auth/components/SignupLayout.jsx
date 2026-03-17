import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '@/routes/config';
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
}) => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-gray-600">Get started with Consolto today</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl bg-white p-8 shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Full name"
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={fields.name}
              onChange={setField('name')}
              placeholder="John Doe"
              inputComponent={Input}
              error={!!errors.name}
              errorMessage={errors.name?.[0]}
            />

            <FormField
              label="Email address"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={fields.email}
              onChange={setField('email')}
              placeholder="you@example.com"
              inputComponent={Input}
              error={!!errors.email}
              errorMessage={errors.email?.[0]}
            />

            <FormField
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={fields.password}
              onChange={setField('password')}
              placeholder="••••••••"
              inputComponent={Input}
              error={!!errors.password}
              errorMessage={errors.password?.[0]}
            />

            <FormField
              label="Confirm password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={fields.confirmPassword}
              onChange={setField('confirmPassword')}
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

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to={ROUTES.LOGIN}
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>

        <div className="text-center">
          <Link
            to={ROUTES.HOME}
            className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
