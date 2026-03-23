import { motion } from 'framer-motion';
import { UserPlus, Search, MessageCircle } from 'lucide-react';
import { BRAND_HIGHLIGHT_GRADIENT_CLASSES } from '@/shared/constants/brand';

export const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: 'Sign Up',
      description: 'Create your account in seconds and complete your profile to get started.',
      number: '01',
    },
    {
      icon: Search,
      title: 'Choose an Expert',
      description: 'Browse through our verified professionals and find the perfect match for your needs.',
      number: '02',
    },
    {
      icon: MessageCircle,
      title: 'Start Consultation',
      description: 'Connect instantly via chat, voice, or video call and get the guidance you need.',
      number: '03',
    },
  ];

  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-white to-blue-50" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10 sm:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It{' '}
            <span className={BRAND_HIGHLIGHT_GRADIENT_CLASSES}>Works</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">Get started in three simple steps</p>
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 -translate-y-1/2" />

          <div className="grid md:grid-cols-3 gap-5 sm:gap-6 md:gap-4 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all border border-blue-100 relative z-10"
                  transition={{ duration: 4, repeat: Infinity, delay: index * 0.3 }}
                  whileHover={{ scale: 1.05, y: -6 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center shadow-lg">
                        <step.icon className="text-white" size={36} />
                      </div>
                      <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {step.number}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
