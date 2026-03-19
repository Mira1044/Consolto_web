import { useRef, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes/config';
import { Button } from '@/shared/components/ui';

const baseNavLinks = [
  { label: 'Home', path: ROUTES.HOME, hash: '#home' },
  // { label: 'Features', path: ROUTES.HOME, hash: '#features' },
  // { label: 'How It Works', path: ROUTES.HOME, hash: '#how-it-works' },
  // { label: 'Testimonials', path: ROUTES.HOME, hash: '#testimonials' },
  // { label: 'Contact', path: ROUTES.CONTACT },
];

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogin = () => {
    setIsMobileMenuOpen(false);
    navigate(ROUTES.LOGIN);
  };

  const handleSignup = () => {
    setIsMobileMenuOpen(false);
    navigate(ROUTES.SIGNUP);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const onDown = (e) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target)) setIsProfileOpen(false);
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') setIsProfileOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const navHref = (item) => {
    if ('hash' in item) return location.pathname === ROUTES.HOME ? item.hash : `${item.path}${item.hash}`;
    return item.path;
  };

  const navLinks = isLoggedIn
    ? [baseNavLinks[0], { label: 'Bookings', path: ROUTES.BOOKINGS }, ...baseNavLinks.slice(1)]
    : baseNavLinks;

  const MotionButton = motion(Button);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20 gap-3">
          <Link to="/" className="flex items-center gap-2.5">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
            >
              Consolto
            </motion.span>
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              'hash' in link ? (
                <a
                  key={link.label}
                  href={navHref(link)}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group whitespace-nowrap"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.path}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group whitespace-nowrap"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
                </Link>
              )
            ))}
            {isLoggedIn ? (
              <>
                {/* <Link to={ROUTES.EXPERTS}>
                  <MotionButton
                    variant="ghost"
                    size="sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full border border-gray-300 hover:border-blue-500 px-4 lg:px-5 py-2.5 text-gray-700 hover:text-blue-600 shadow-none bg-transparent"
                  >
                    Experts
                  </MotionButton>
                </Link> */}
                <MotionButton
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  size="sm"
                  className="rounded-full px-5 lg:px-6 py-2.5 whitespace-nowrap"
                >
                  Log out
                </MotionButton>

                <div ref={profileRef} className="relative">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsProfileOpen((v) => !v)}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-3 py-2 shadow-sm hover:bg-white transition-colors"
                    aria-haspopup="menu"
                    aria-expanded={isProfileOpen}
                  >
                    <span className="h-8 w-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
                      <User size={18} />
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                    />
                  </motion.button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-100 bg-white shadow-lg overflow-hidden">
                      <div className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user?.firstName || user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user?.email || '—'}</p>
                      </div>
                      <div className="border-t border-gray-100 p-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          fullWidth
                          className="rounded-lg justify-start"
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsMobileMenuOpen(false);
                            logout();
                          }}
                        >
                          Log out
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <MotionButton
                  type="button"
                  onClick={handleLogin}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  variant="ghost"
                  size="sm"
                  className="rounded-full border border-gray-300 hover:border-blue-500 px-4 lg:px-5 py-2.5 text-gray-700 hover:text-blue-600 shadow-none bg-transparent whitespace-nowrap"
                >
                  Log in
                </MotionButton>
                <MotionButton
                  type="button"
                  onClick={handleSignup}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  size="sm"
                  className="rounded-full px-5 lg:px-6 py-2.5 whitespace-nowrap"
                >
                  Sign up
                </MotionButton>
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
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              'hash' in link ? (
                <a
                  key={link.label}
                  href={navHref(link)}
                  className="block text-gray-700 hover:text-blue-600 font-medium py-2.5 rounded-lg px-2 hover:bg-blue-50/60 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.path}
                  className="block text-gray-700 hover:text-blue-600 font-medium py-2.5 rounded-lg px-2 hover:bg-blue-50/60 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            ))}
            {isLoggedIn ? (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to={ROUTES.EXPERTS}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    className="rounded-full border border-gray-300 hover:border-blue-500 px-6 py-2.5 text-gray-700 hover:text-blue-600 shadow-none bg-transparent"
                  >
                    Experts
                  </Button>
                </Link>
                <Button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  fullWidth
                  size="sm"
                  className="rounded-full px-6 py-2.5"
                >
                  Log out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  type="button"
                  onClick={handleLogin}
                  variant="ghost"
                  size="sm"
                  fullWidth
                  className="rounded-full border border-gray-300 hover:border-blue-500 px-6 py-2.5 text-gray-700 hover:text-blue-600 shadow-none bg-transparent"
                >
                  Log in
                </Button>
                <Button
                  type="button"
                  onClick={handleSignup}
                  fullWidth
                  size="sm"
                  className="rounded-full px-6 py-2.5"
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};
