import { motion } from 'framer-motion';
import { BRAND_HIGHLIGHT_GRADIENT_CLASSES } from '@/shared/constants/brand';
import { Zap, Shield, Calendar, Clock } from 'lucide-react';

export const Features = () => {
  const features = [
    {
      icon: Zap,
      title: 'Instant Expert Advice',
      description: 'Get connected with professionals in minutes. No waiting, no hassle.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Shield,
      title: 'Secure & Private Conversations',
      description: 'End-to-end encryption ensures your consultations remain confidential.',
      gradient: 'from-blue-600 to-indigo-500',
    },
    {
      icon: Calendar,
      title: 'Easy Appointment Booking',
      description: 'Schedule consultations that fit your timeline with our smart booking system.',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Access expert guidance whenever you need it, day or night.',
      gradient: 'from-indigo-500 to-blue-600',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10 sm:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose{' '}
            <span className={BRAND_HIGHLIGHT_GRADIENT_CLASSES}>Consolto</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of online consultations with our cutting-edge platform
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true }}
          whileInView="visible"
        >
          {features.map((feature, index) => (
            <motion.div key={index} className="group" variants={itemVariants} whileHover={{ y: -10, transition: { duration: 0.2 } }}>
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-blue-100 h-full">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
