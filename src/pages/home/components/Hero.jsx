import { motion } from 'framer-motion';
import { BRAND_HIGHLIGHT_GRADIENT_CLASSES } from '@/shared/constants/brand';

export const Hero = () => {
  /** Percent-based positions so cards stay inside the visual frame on all widths */
  const floatingCards = [
    { delay: 0, left: '8%', top: '12%' },
    { delay: 0.2, left: '42%', top: '38%' },
    { delay: 0.4, left: '18%', top: '52%' },
  ];

  return (
    <section
      id="home"
      className="relative flex min-h-[min(100dvh,880px)] w-full flex-1 flex-col justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 sm:h-full sm:min-h-0 sm:py-10 md:py-8 lg:min-h-screen lg:py-12"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-72 h-72 absolute left-10 top-20 animate-blob rounded-full bg-blue-200 opacity-30 mix-blend-multiply blur-xl filter"></div>
        <div className="w-72 h-72 animation-delay-2000 absolute right-10 top-40 animate-blob rounded-full bg-blue-300 opacity-30 mix-blend-multiply blur-xl filter"></div>
        <div className="w-72 h-72 animation-delay-4000 absolute -bottom-8 left-1/2 animate-blob rounded-full bg-blue-400 opacity-30 mix-blend-multiply blur-xl filter"></div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 md:py-8 lg:px-8 lg:py-10">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-5 text-4xl sm:text-5xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-7xl"
            >
              Connect with{' '}
              <span className={BRAND_HIGHLIGHT_GRADIENT_CLASSES}>Experts</span>{' '}
              Anytime, Anywhere
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6 text-base sm:text-lg leading-relaxed text-gray-600 md:text-lg lg:text-xl"
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
            className="relative mx-auto mt-8 flex w-full max-w-md items-center justify-center [perspective:1200px] sm:mt-10 lg:mx-0 lg:mt-0 lg:max-w-none"
          >
            <div className="relative aspect-square w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px]">
              {floatingCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: card.delay + 0.5, duration: 0.5 }}
                  className="absolute z-[1] w-[min(42%,140px)] sm:w-[min(40%,150px)]"
                  style={{ left: card.left, top: card.top }}
                >
                  <motion.div
                    animate={{
                      y: [0, -12, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: card.delay,
                    }}
                    className="rounded-2xl border border-blue-100 bg-white/90 p-4 shadow-xl backdrop-blur-md sm:p-5"
                  >
                    <div className="mb-2 h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 sm:mb-3 sm:h-14 sm:w-14" />
                    <div className="mb-1.5 h-2.5 w-20 rounded bg-gray-200 sm:h-3 sm:w-24" />
                    <div className="h-2 w-14 rounded bg-gray-100 sm:w-16" />
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
