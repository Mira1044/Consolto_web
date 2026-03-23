import { motion } from 'framer-motion';
import { Award, Zap, Lock, DollarSign } from 'lucide-react';
import { BRAND_HIGHLIGHT_GRADIENT_CLASSES } from '@/shared/constants/brand';

export const Benefits = () => {
  const benefits = [
    {
      icon: Award,
      title: 'Trusted Experts',
      description: 'All professionals are thoroughly vetted and verified for quality assurance.',
    },
    {
      icon: Zap,
      title: 'Fast Responses',
      description: 'Get answers to your questions quickly with our real-time communication system.',
    },
    {
      icon: Lock,
      title: 'Secure Platform',
      description: 'Your data and conversations are protected with enterprise-grade security.',
    },
    {
      icon: DollarSign,
      title: 'Affordable Services',
      description: 'Access expert consultation at competitive rates that fit your budget.',
    },
  ];

  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10 sm:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Platform{' '}
            <span className={BRAND_HIGHLIGHT_GRADIENT_CLASSES}>Benefits</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover what makes Consolto the best choice for online consultations
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="text-center group"
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              whileInView={{ opacity: 1, scale: 1 }}
            >
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-blue-100">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <benefit.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
