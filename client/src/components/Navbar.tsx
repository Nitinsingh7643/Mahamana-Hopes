import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart, ChevronDown, Moon, Sun, LogIn, LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import logoUrl from '../assets/logo.png';

const navLinks = [
  { label: 'About', path: '/about' },
  {
    label: 'Our Work',
    path: '/our-work',
    children: [
      { label: 'Education', path: '/education' },
      { label: 'Healthcare', path: '/healthcare' },
      { label: 'Environment', path: '/environment' },
    ],
  },
  { label: 'Impact', path: '/impact' },
  { label: 'Campaigns', path: '/campaigns' },
  { label: 'Stories', path: '/stories' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userDropdown, setUserDropdown] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setOpenDropdown(null);
  }, [location]);

  const isHome = location.pathname === '/';
  const showTransparent = isHome && !isScrolled && !isMobileOpen;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showTransparent
            ? 'bg-transparent'
            : 'bg-white/95 backdrop-blur-md shadow-sm'
        }`}
      >
        <nav className="container-max flex items-center justify-between h-[72px]" aria-label="Main navigation">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" aria-label="Mahamana Hopes Foundation Home">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center p-1 shadow-md group-hover:scale-105 transition-transform overflow-hidden border border-gray-100">
              <img src={logoUrl} alt="Mahamana Hopes Foundation Logo" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block">
              <span className={`font-heading font-bold text-lg leading-tight block ${showTransparent ? 'text-white' : 'text-primary-500'}`}>
                Mahamana Hopes
              </span>
              <span className={`text-[10px] tracking-[0.15em] uppercase font-semibold ${showTransparent ? 'text-white/70' : 'text-green-600'}`}>
                Foundation
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.path}
                className="relative"
                onMouseEnter={() => link.children && setOpenDropdown(link.path)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  to={link.path}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    location.pathname === link.path
                      ? showTransparent ? 'text-white bg-white/20' : 'text-primary-500 bg-primary-50'
                      : showTransparent ? 'text-white/90 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-primary-500 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                  {link.children && <ChevronDown className="w-3.5 h-3.5" />}
                </Link>
                
                {link.children && (
                  <AnimatePresence>
                    {openDropdown === link.path && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px]"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className="block px-4 py-2.5 text-sm text-gray-600 hover:text-primary-500 hover:bg-primary-50/50 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${
                showTransparent ? 'text-white hover:bg-white/20' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-2 pl-1 border-l border-gray-200/50">
                {isAdmin ? (
                  <Link
                    to="/admin/dashboard"
                    className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin Panel
                  </Link>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800 flex items-center gap-1">
                    <UserIcon className="w-3 h-3" />
                    {user.name.split(' ')[0]}
                  </span>
                )}
                <button
                  onClick={logout}
                  title="Sign Out"
                  className={`p-1.5 rounded-full transition-colors ${
                    showTransparent ? 'text-white/80 hover:text-white hover:bg-white/20' : 'text-gray-500 hover:text-rose-600 hover:bg-rose-50'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  showTransparent
                    ? 'text-white border border-white/50 hover:bg-white hover:text-primary-600'
                    : 'text-gray-700 border border-gray-300 hover:border-primary-500 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </Link>
            )}

            <Link
              to="/volunteer"
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                showTransparent
                  ? 'text-white border-2 border-white/40 hover:bg-white hover:text-primary-500'
                  : 'text-primary-500 border-2 border-primary-500 hover:bg-primary-500 hover:text-white'
              }`}
            >
              Volunteer
            </Link>
            <Link
              to="/donate"
              className="btn btn-green text-sm !py-2 !px-5"
            >
              <Heart className="w-4 h-4" /> Donate
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={`lg:hidden p-2 rounded-lg ${showTransparent ? 'text-white' : 'text-primary-500'}`}
            aria-label="Toggle menu"
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="container-max py-4 space-y-1">
                {navLinks.map((link) => (
                  <div key={link.path}>
                    <Link
                      to={link.path}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === link.path
                          ? 'text-primary-500 bg-primary-50'
                          : 'text-gray-600 hover:text-primary-500 hover:bg-gray-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="ml-4 space-y-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className="block px-4 py-2 rounded-lg text-sm text-gray-500 hover:text-primary-500 hover:bg-gray-50"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-4 flex flex-col gap-3 border-t border-gray-100 dark:border-gray-800 mt-3">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary-500"
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                  </button>

                  {user ? (
                    <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-800">{user.name}</span>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-primary-100 text-primary-800">
                          {user.role}
                        </span>
                      </div>
                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-sm"
                        >
                          <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 py-2 border border-rose-200 text-rose-600 rounded-lg text-xs font-semibold hover:bg-rose-50"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center gap-2 py-2.5 border border-primary-500 text-primary-600 rounded-xl text-sm font-semibold hover:bg-primary-50"
                    >
                      <LogIn className="w-4 h-4" /> Sign In / Register
                    </Link>
                  )}

                  <Link to="/volunteer" className="btn btn-outline text-sm w-full">
                    Volunteer
                  </Link>
                  <Link to="/donate" className="btn btn-green text-sm w-full">
                    <Heart className="w-4 h-4" /> Donate Now
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile sticky donate button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 p-3">
        <Link to="/donate" className="btn btn-green w-full text-sm">
          <Heart className="w-4 h-4" /> Donate Now
        </Link>
      </div>
    </>
  );
}
