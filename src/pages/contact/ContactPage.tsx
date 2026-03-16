import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setSubmitted(true);
    // Frontend-only demo submit
    setTimeout(() => setSubmitted(false), 2500);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Contact us</h1>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl">
            Tell us what you need help with and we&apos;ll get back to you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Contact info</h2>
              <ul className="space-y-4 text-slate-700">
                <li className="flex items-start gap-3">
                  <Mail className="text-blue-600 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      className="text-slate-600 hover:text-blue-600"
                      href="mailto:support@consolto.com"
                    >
                      contact@consolto.in
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="text-blue-600 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a className="text-slate-600 hover:text-blue-600" href="tel:+15551234567">
                      +91 9689873927
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="text-blue-600 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-slate-600">
                      123 Business Ave, Suite 100
                      <br />
                      San Francisco, CA 94107
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-sm">
              <p className="text-sm text-white/80">Support hours</p>
              <p className="mt-1 text-lg font-semibold">Mon–Sat, 10:00 AM – 7:00 PM</p>
              <p className="mt-2 text-white/80">
                For urgent issues, include &quot;URGENT&quot; in the subject.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Send a message</h2>

              {submitted && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800"
                  initial={{ opacity: 0, y: -6 }}
                >
                  Message sent (demo). We&apos;ll contact you soon.
                </motion.div>
              )}

              <form className="space-y-5" onSubmit={onSubmit}>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label
                      className="block text-sm font-medium text-slate-700 mb-2"
                      htmlFor="contact-name"
                    >
                      Name
                    </label>
                    <input
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-base text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      id="contact-name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-slate-700 mb-2"
                      htmlFor="contact-email"
                    >
                      Email
                    </label>
                    <input
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-base text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      id="contact-email"
                      placeholder="you@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-slate-700 mb-2"
                    htmlFor="contact-subject"
                  >
                    Subject
                  </label>
                  <input
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-base text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    id="contact-subject"
                    placeholder="How can we help?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-slate-700 mb-2"
                    htmlFor="contact-message"
                  >
                    Message
                  </label>
                  <textarea
                    required
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    id="contact-message"
                    placeholder="Write your message..."
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                  type="submit"
                >
                  <Send size={18} />
                  Send message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
