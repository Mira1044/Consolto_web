import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const CTA = () => (
    <section className="py-14 sm:py-16 lg:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700" />

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 sm:mb-6">
            Start Your First Consultation Today
          </h2>
          <p className="text-base sm:text-lg md:text-2xl text-blue-100 mb-8 sm:mb-10 leading-relaxed">
            Join thousands of users connecting with experts worldwide. Get the guidance you need,
            when you need it.
          </p>

          <motion.button
            animate={{ scale: [1, 1.03, 1] }}
            className="bg-white text-blue-600 px-7 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg shadow-2xl hover:shadow-3xl transition-all inline-flex items-center gap-2 sm:gap-3 group"
            transition={{ duration: 2.5, repeat: Infinity, repeatType: 'loop' }}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Now
            <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
          </motion.button>

          <p className="text-blue-100 mt-6">No credit card required • Free to sign up</p>
        </motion.div>
      </div>
    </section>
  );
