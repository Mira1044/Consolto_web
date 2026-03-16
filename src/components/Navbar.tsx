import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const navLinks = [
  { label: 'Home', path: '/', hash: '#home' },
  { label: 'Features', path: '/', hash: '#features' },
  { label: 'How It Works', path: '/', hash: '#how-it-works' },
  { label: 'Testimonials', path: '/', hash: '#testimonials' },
  { label: 'Contact', path: '/contact' as const },
];

export default function Navbar() {
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const openLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
    setIsMobileMenuOpen(false);
  };
  const openSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navHref = (item: (typeof navLinks)[0]) => {
    if ('hash' in item) return location.pathname === '/' ? item.hash : `${item.path}${item.hash}`;
    return item.path;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      {/* SVG filter: transparent background + solid dark blue icon for a clear, sharp logo */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="logo-clear-dark" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              in="SourceGraphic"
              result="colored"
              values="0 0 0 0 0.09  0 0 0 0 0.22  0 0 0 0 0.45  0.5 0.5 0.5 0 -0.12"
            />
          </filter>
        </defs>
      </svg>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="inline-block h-8 w-8 md:h-9 md:w-9 flex-shrink-0" style={{ filter: 'url(#logo-clear-dark)' }}>
              <img
                src="/consolto-logo.png"
                alt="Consolto"
                className="h-full w-full object-contain block select-none"
              />
            </span>
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
            >
              Consolto
            </motion.span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={navHref(link)}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            {isLoggedIn ? (
              <>
                <Link to="/experts">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-700 hover:text-blue-600 font-semibold px-5 py-2.5 rounded-full border border-gray-300 hover:border-blue-500 transition-all inline-block"
                  >
                    Experts
                  </motion.span>
                </Link>
                <motion.button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Log out
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  type="button"
                  onClick={openLogin}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-700 hover:text-blue-600 font-semibold px-5 py-2.5 rounded-full border border-gray-300 hover:border-blue-500 transition-all"
                >
                  Log in
                </motion.button>
                <motion.button
                  type="button"
                  onClick={openSignup}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Sign up
                </motion.button>
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
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
                key={link.label}
                href={navHref(link)}
                className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {isLoggedIn ? (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/experts"
                  className="w-full text-center text-gray-700 font-semibold px-6 py-2.5 rounded-full border border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Experts
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-center bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2.5 rounded-full font-semibold"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={openLogin}
                  className="w-full text-center text-gray-700 font-semibold px-6 py-2.5 rounded-full border border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={openSignup}
                  className="w-full text-center bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2.5 rounded-full font-semibold"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
      <LoginForm isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <SignupForm isOpen={showSignupModal} onClose={() => setShowSignupModal(false)} />
    </motion.nav>
  );
}
