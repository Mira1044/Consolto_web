import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

export default function Hero() {
  const floatingCards = [
    { delay: 0, x: 50, y: 30 },
    { delay: 0.2, x: -30, y: 50 },
    { delay: 0.4, x: 70, y: -20 },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6"
            >
              Connect with{' '}
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Experts
              </span>{' '}
              Anytime, Anywhere
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
            >
              Get professional consultation and expert guidance from the comfort of your home.
              Connect with verified professionals across various fields instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 group"
              >
                Start Consultation
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
              >
                <Play size={20} />
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden md:block"
          >
            {floatingCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: card.delay + 0.5, duration: 0.5 }}
                className="absolute"
                style={{ right: `${card.x}px`, top: `${card.y}px` }}
              >
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: card.delay,
                  }}
                  className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-blue-100"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-2 bg-gray-100 rounded w-16"></div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
