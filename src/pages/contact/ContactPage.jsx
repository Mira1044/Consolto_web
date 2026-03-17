

import { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useInView,
} from 'framer-motion';

/* ─── Magnetic Send Button ─── */
const MagneticButton = ({ children, disabled, type = 'submit' }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.3);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileTap={{ scale: 0.95 }}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-shadow disabled:opacity-60 cursor-pointer overflow-hidden relative group"
    >
      <span className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 bg-white/20 skew-x-[-20deg] pointer-events-none" />
      <span className="relative flex items-center gap-2">{children}</span>
    </motion.button>
  );
};

/* ─── Animated float-label field ─── */
const FloatField = ({ label, id, type = 'text', value, onChange, placeholder, required, multiline }) => {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;
  const Tag = multiline ? 'textarea' : 'input';

  return (
    <div className="relative">
      <Tag
        id={id}
        type={type}
        required={required}
        value={value}
        placeholder={lifted ? placeholder : ' '}
        rows={multiline ? 6 : undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={onChange}
        className="peer w-full rounded-xl border border-slate-200 px-4 pt-6 pb-3 text-base text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all duration-200"
      />
      <motion.label
        htmlFor={id}
        animate={{
          top: lifted ? '6px' : '14px',
          fontSize: lifted ? '0.68rem' : '0.875rem',
          color: focused ? '#2563eb' : '#94a3b8',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="absolute left-4 pointer-events-none font-medium"
        style={{ top: '14px', fontSize: '0.875rem', color: '#94a3b8' }}
      >
        {label}
      </motion.label>
    </div>
  );
};

/* ─── Info list item ─── */
const InfoItem = ({ icon: Icon, label, value, href, delay }) => (
  <motion.li
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.45, delay }}
    whileHover={{ x: 4 }}
    className="flex items-start gap-3"
  >
    <motion.div
      whileHover={{ scale: 1.2, rotate: 8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      className="mt-0.5"
    >
      <Icon className="text-blue-600" size={20} />
    </motion.div>
    <div>
      <p className="font-medium text-slate-700">{label}</p>
      <a className="text-slate-600 hover:text-blue-600 transition-colors" href={href}>
        {value}
      </a>
    </div>
  </motion.li>
);

/* ─── Page ─── */
export const ContactPage = () => {
  const [fields, setFields] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const formRef = useRef(null);
  const inView = useInView(formRef, { once: true, margin: '-60px' });

  const set = (k) => (e) => setFields((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setFields({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 3500);
    }, 1200);
  };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09 } },
  };
  const item = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Contact us</h1>
          <motion.p
            className="mt-3 text-lg text-slate-600 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Tell us what you need help with and we&apos;ll get back to you.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Info */}
          <div className="lg:col-span-1 space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              whileHover={{ boxShadow: '0 8px 32px rgba(37,99,235,0.10)' }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Contact info</h2>
              <ul className="space-y-4 text-slate-700">
                <InfoItem icon={Mail}   label="Email"   value="contact@consolto.in"                          href="mailto:contact@consolto.in" delay={0.2} />
                <InfoItem icon={Phone}  label="Phone"   value="+91 9689873927"                               href="tel:+919689873927"          delay={0.3} />
                <InfoItem icon={MapPin} label="Address" value="123 Business Ave, Suite 100, SF CA 94107"    href="#"                          delay={0.4} />
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.35 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-sm cursor-default"
            >
              <p className="text-sm text-white/80">Support hours</p>
              <p className="mt-1 text-lg font-semibold">Mon–Sat, 10:00 AM – 7:00 PM</p>
              <p className="mt-2 text-white/80">
                For urgent issues, include <span className="font-bold text-white">"URGENT"</span> in the subject.
              </p>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            ref={formRef}
            className="lg:col-span-2"
            variants={container}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
          >
            <motion.div
              variants={item}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8"
            >
              <motion.h2 variants={item} className="text-2xl font-semibold text-slate-900 mb-6">
                Send a message
              </motion.h2>

              <AnimatePresence>
                {submitted && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                    className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 16, delay: 0.1 }}
                    >
                      <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
                    </motion.div>
                    Message sent (demo). We&apos;ll contact you soon.
                  </motion.div>
                )}
              </AnimatePresence>

              <form className="space-y-5" onSubmit={onSubmit}>
                <motion.div variants={item} className="grid md:grid-cols-2 gap-5">
                  <FloatField label="Name"  id="contact-name"  value={fields.name}    onChange={set('name')}    required placeholder="Your name" />
                  <FloatField label="Email" id="contact-email" type="email" value={fields.email} onChange={set('email')} required placeholder="you@example.com" />
                </motion.div>

                <motion.div variants={item}>
                  <FloatField label="Subject" id="contact-subject" value={fields.subject} onChange={set('subject')} required placeholder="How can we help?" />
                </motion.div>

                <motion.div variants={item}>
                  <FloatField label="Message" id="contact-message" value={fields.message} onChange={set('message')} required multiline placeholder="Write your message..." />
                </motion.div>

                <motion.div variants={item}>
                  <MagneticButton type="submit" disabled={sending}>
                    {sending ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
                          className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
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