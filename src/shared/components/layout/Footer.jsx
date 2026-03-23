import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { BrandLogo } from '@/shared/components/BrandLogo';
import { ROUTES } from '@/routes/config';

export const Footer = () => {
  const quickLinks = ['Features', 'How It Works', 'Pricing', 'About Us', 'Blog', 'Careers'];
  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/bconsolto/', label: 'Facebook' },
    { icon: Twitter, href: 'https://x.com/Consolto_777', label: 'Twitter' },
    { icon: Instagram, href: 'https://www.instagram.com/consolto_official/', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="mb-4">
              <BrandLogo to={ROUTES.HOME} variant="onDark" />
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Connect with verified experts anytime, anywhere. Professional consultation made simple
              and accessible.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  href={social.href}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h4 className="text-white font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    className="hover:text-blue-400 transition-colors inline-block hover:translate-x-1 transform duration-200"
                    href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h4 className="text-white font-bold text-lg mb-4">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="text-blue-400 mt-1 flex-shrink-0" size={20} />
                <span>contact@consolto.in</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="text-blue-400 mt-1 flex-shrink-0" size={20} />
                <span>+91 9689873927</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="text-blue-400 mt-1 flex-shrink-0" size={20} />
                <span>
                  123 Business Ave, Suite 100<br />
                  San Francisco, CA 94107
                </span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h4 className="text-white font-bold text-lg mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to get updates on new features and expert tips.
            </p>
            <div className="flex flex-col gap-3">
              <input
                className="bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                type="email"
              />
              <button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Consolto. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
