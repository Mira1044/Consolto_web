import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Home', 'Features', 'How It Works', 'Testimonials', 'Contact'];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
          >
            Consolto
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <motion.a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                whileHover={{ y: -2 }}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
              >
                {link}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </motion.a>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Get Started
            </motion.button>
          </div>

          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white/95 backdrop-blur-md border-t"
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link}
              </a>
            ))}
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2.5 rounded-full font-semibold">
              Get Started
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
