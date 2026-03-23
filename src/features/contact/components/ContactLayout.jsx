import { useRef } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

import { FloatField } from './FloatField';
import { MagneticButton } from './MagneticButton';
import { InfoItem } from './InfoItem';
import { staggerContainer, staggerItem, CONTACT_INFO } from '../utils/contactUtils';

/**
 * Icon lookup – maps string names from CONTACT_INFO to Lucide components.
 */
const ICON_MAP = { Mail, Phone, MapPin };

/**
 * ContactLayout
 * Pure presentational component that renders the contact page UI.
 * Receives all data and handlers via props — no business logic inside.
 */
export const ContactLayout = ({
  fields,
  errors,
  submitted,
  sending,
  setField,
  handleSubmit,
}) => {
  const formRef = useRef(null);
  const inView = useInView(formRef, { once: true, margin: '-60px' });

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
          initial={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.55 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Contact us</h1>
          <motion.p
            animate={{ opacity: 1 }}
            className="mt-3 text-lg text-slate-600 max-w-2xl"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Tell us what you need help with and we&apos;ll get back to you.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Info sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
              initial={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              whileHover={{ boxShadow: '0 8px 32px rgba(37,99,235,0.10)' }}
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Contact info</h2>
              <ul className="space-y-4 text-slate-700">
                {CONTACT_INFO.map((info, idx) => (
                  <InfoItem
                    key={info.id}
                    delay={0.2 + idx * 0.1}
                    href={info.href}
                    icon={ICON_MAP[info.iconName]}
                    label={info.label}
                    value={info.value}
                  />
                ))}
              </ul>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-sm cursor-default"
              initial={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.45, delay: 0.35 }}
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-sm text-white/80">Support hours</p>
              <p className="mt-1 text-lg font-semibold">Mon–Sat, 10:00 AM – 7:00 PM</p>
              <p className="mt-2 text-white/80">
                For urgent issues, include{' '}
                <span className="font-bold text-white">&quot;URGENT&quot;</span> in the subject.
              </p>
            </motion.div>
          </div>

          {/* Form section */}
          <motion.div
            ref={formRef}
            animate={inView ? 'show' : 'hidden'}
            className="lg:col-span-2"
            initial="hidden"
            variants={staggerContainer}
          >
            <motion.div
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8"
              variants={staggerItem}
            >
              <motion.h2
                className="text-2xl font-semibold text-slate-900 mb-6"
                variants={staggerItem}
              >
                Send a message
              </motion.h2>

              <AnimatePresence>
                {submitted && (
                  <motion.div
                    key="success"
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800"
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                  >
                    <motion.div
                      animate={{ scale: 1 }}
                      initial={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 16, delay: 0.1 }}
                    >
                      <CheckCircle className="text-emerald-600 flex-shrink-0" size={18} />
                    </motion.div>
                    Message sent (demo). We&apos;ll contact you soon.
                  </motion.div>
                )}
              </AnimatePresence>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <motion.div className="grid md:grid-cols-2 gap-5" variants={staggerItem}>
                  <FloatField
                    required
                    error={errors.name}
                    id="contact-name"
                    label="Name"
                    placeholder="Your name"
                    value={fields.name}
                    onChange={setField('name')}
                  />
                  <FloatField
                    required
                    error={errors.email}
                    id="contact-email"
                    label="Email"
                    placeholder="you@example.com"
                    type="email"
                    value={fields.email}
                    onChange={setField('email')}
                  />
                </motion.div>

                <motion.div variants={staggerItem}>
                  <FloatField
                    required
                    error={errors.subject}
                    id="contact-subject"
                    label="Subject"
                    placeholder="How can we help?"
                    value={fields.subject}
                    onChange={setField('subject')}
                  />
                </motion.div>

                <motion.div variants={staggerItem}>
                  <FloatField
                    multiline
                    required
                    error={errors.message}
                    id="contact-message"
                    label="Message"
                    placeholder="Write your message..."
                    value={fields.message}
                    onChange={setField('message')}
                  />
                </motion.div>

                <motion.div variants={staggerItem}>
                  <MagneticButton disabled={sending} type="submit">
                    {sending ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                          transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
                        />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send message
                      </>
                    )}
                  </MagneticButton>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
