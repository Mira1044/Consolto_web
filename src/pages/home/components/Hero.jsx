import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

export const Hero = () => {
  const floatingCards = [
    { delay: 0, x: 50, y: 30 },
    { delay: 0.2, x: -30, y: 50 },
    { delay: 0.4, x: 70, y: -20 },
  ];

  return (
    <section
      id="home"
      className="relative flex h-full items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-8 sm:pt-12"
    >
      {/* Top-left Consolto logo on hero */}
      <div className="z-20 absolute left-4 sm:left-6 top-2 sm:top-3 flex items-center gap-2">
        <img
          src="/assets/Consolto-002.png"
          alt="Consolto"
          className="h-10 sm:h-12 w-auto max-w-[160px] sm:max-w-[176px] flex-shrink-0 select-none object-contain"
          draggable="false"
        />
        <span className="text-base sm:text-lg font-semibold tracking-tight text-blue-600">consolto</span>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="w-72 h-72 absolute left-10 top-20 animate-blob rounded-full bg-blue-200 opacity-30 mix-blend-multiply blur-xl filter"></div>
        <div className="w-72 h-72 animation-delay-2000 absolute right-10 top-40 animate-blob rounded-full bg-blue-300 opacity-30 mix-blend-multiply blur-xl filter"></div>
        <div className="w-72 h-72 animation-delay-4000 absolute -bottom-8 left-1/2 animate-blob rounded-full bg-blue-400 opacity-30 mix-blend-multiply blur-xl filter"></div>
      </div>

      <div className="z-10 relative mx-auto max-w-6xl px-4 pb-10 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pt-24">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 text-4xl sm:text-5xl font-bold leading-tight text-gray-900 md:text-6xl lg:text-7xl"
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
              className="mb-8 text-base sm:text-lg leading-relaxed text-gray-600 md:text-xl"
            >
              Get professional consultation and expert guidance from the comfort of your home.
              Connect with verified professionals across various fields instantly.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ rotateX: -6, rotateY: 6, scale: 1.02 }}
            className="relative mt-8 flex items-center justify-center [perspective:1200px] lg:mt-0"
          >
            <div className="relative h-56 w-56">
              {floatingCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: card.delay + 0.5, duration: 0.5 }}
                  className="absolute"
                  style={{ left: `${card.x}px`, top: `${card.y}px` }}
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
                    className="rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-xl backdrop-blur-md"
                  >
                    <div className="mb-3 h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600"></div>
                    <div className="rounded mb-2 h-3 w-24 bg-gray-200"></div>
                    <div className="rounded h-2 w-16 bg-gray-100"></div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
