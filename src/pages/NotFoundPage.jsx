import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/routes/config';

export const NotFoundPage = () => (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ scale: 1 }}
          className="mb-8"
          initial={{ scale: 0.8 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-9xl font-bold text-gray-200">404</h1>
        </motion.div>

        <motion.div
          animate={{ opacity: 1 }}
          className="space-y-4"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-gray-900">Page not found</h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The page might have been moved or doesn&apos;t exist.
          </p>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all"
            to={ROUTES.HOME}
          >
            <Home size={20} />
            Go to Home
          </Link>
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
