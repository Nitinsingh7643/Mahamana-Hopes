import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Mail, User as UserIcon, Phone, ArrowRight, ArrowLeft,
  Eye, EyeOff, ShieldCheck, Heart, Sparkles, CheckCircle2, HelpCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuth } from '../components/AuthContext';
import logoUrl from '../assets/logo.png';
import showcaseImg from '../assets/gallery/team_with_children_1.jpg';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<'volunteer' | 'donor' | 'user'>('volunteer');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, navigate]);

  const isAdminLoginPath = location.pathname.includes('/admin/login');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await authAPI.login({ email, password });
      if (data.success) {
        login(data.token, data.user);
        toast.success(`Welcome back, ${data.user.name}!`);

        if (data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await authAPI.register({
        name,
        email,
        password,
        phone,
        role: selectedRole,
      });

      if (data.success) {
        login(data.token, data.user);
        toast.success(`Welcome to Mahamana Hopes Foundation, ${data.user.name}!`);
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    toast((t) => (
      <div className="text-xs text-gray-700">
        <p className="font-bold text-gray-900 mb-1">Password Assistance</p>
        <p>Please contact our support team at <a href="mailto:mahamanahopes@gmail.com" className="text-primary-600 font-semibold underline">mahamanahopes@gmail.com</a> with your registered email.</p>
      </div>
    ), { duration: 6000 });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center">
      <Helmet>
        <title>{isRegister ? 'Create Account' : 'Sign In'} — Mahamana Hopes Foundation</title>
      </Helmet>

      {/* Main Split-Screen Container */}
      <div className="min-h-screen flex flex-col lg:flex-row">
        
        {/* ================= LEFT SHOWCASE PANEL (Desktop) ================= */}
        <div className="relative lg:w-1/2 bg-slate-950 text-white flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden min-h-[340px] lg:min-h-screen">
          {/* Background Image with Dark Atmospheric Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={showcaseImg}
              alt="Mahamana Hopes humanitarian initiative"
              className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-110"
            />
            {/* Rich multi-stop gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-primary-950/60 backdrop-blur-[1px]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />
          </div>

          {/* Top Brand Pill */}
          <div className="relative z-10 flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-white/95 p-1.5 shadow-lg shadow-black/20 group-hover:scale-105 transition-transform overflow-hidden flex items-center justify-center">
                <img src={logoUrl} alt="Mahamana Hopes Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-heading font-bold text-lg text-white block leading-tight tracking-wide">
                  Mahamana Hopes
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-emerald-400">
                  Foundation
                </span>
              </div>
            </Link>

            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white/80 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Website</span>
            </Link>
          </div>

          {/* Center Inspirational Statement */}
          <div className="relative z-10 my-8 lg:my-auto max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Changing Lives • Creating Hopes</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-[1.15] tracking-tight">
              Empowering communities with dignity & purpose.
            </h1>

            <p className="text-white/80 text-sm sm:text-base leading-relaxed mt-4 font-normal">
              Whether you are an administrator, a dedicated volunteer on the ground, or a generous supporter, your contribution shapes the lives of thousands.
            </p>

            {/* Live Metrics Floating Grid */}
            <div className="grid grid-cols-3 gap-3 mt-8">
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <p className="text-xl sm:text-2xl font-extrabold text-white">5,000+</p>
                <p className="text-[11px] text-white/70 font-medium mt-0.5">Lives Touched</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <p className="text-xl sm:text-2xl font-extrabold text-emerald-400">10,000+</p>
                <p className="text-[11px] text-white/70 font-medium mt-0.5">Trees Planted</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <p className="text-xl sm:text-2xl font-extrabold text-amber-300">1,000+</p>
                <p className="text-[11px] text-white/70 font-medium mt-0.5">Students Guided</p>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-white/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Registered Public Charitable Trust • 80G Certified</span>
            </div>
            <span>© {new Date().getFullYear()} Mahamana Hopes</span>
          </div>
        </div>

        {/* ================= RIGHT FORM PANEL ================= */}
        <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-white overflow-y-auto">
          <div className="w-full max-w-md">

            {/* Mobile Back Link */}
            <div className="lg:hidden mb-6">
              <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Website
              </Link>
            </div>

            {/* Header Greeting */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
                {isAdminLoginPath 
                  ? 'Administrator Portal' 
                  : isRegister ? 'Create Your Account' : 'Welcome Back'}
              </h2>
              <p className="text-sm text-slate-500 mt-1.5">
                {isAdminLoginPath 
                  ? 'Sign in to access admin tools, campaigns, and volunteer review.' 
                  : isRegister 
                  ? 'Join our community to participate in programs, track donations, and volunteer.' 
                  : 'Enter your account details to access your dashboard and activities.'}
              </p>
            </div>

            {/* Animated Tab Switcher (Sign In vs Register) */}
            {!isAdminLoginPath && (
              <div className="bg-slate-100/90 p-1 rounded-xl flex items-center mb-7 border border-slate-200/60 shadow-inner">
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all relative ${
                    !isRegister
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all relative ${
                    isRegister
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Forms with AnimatePresence for buttery smooth transitions */}
            <AnimatePresence mode="wait">
              {!isRegister ? (
                /* ================= SIGN IN FORM ================= */
                <motion.form
                  key="signin-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleLoginSubmit}
                  className="space-y-5"
                >
                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-11 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500 cursor-pointer"
                      />
                      <span className="text-xs text-slate-600 font-medium">Keep me signed in</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full group relative overflow-hidden py-3.5 px-5 rounded-xl bg-gradient-to-r from-primary-600 via-primary-700 to-emerald-700 hover:from-primary-700 hover:to-emerald-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying credentials...</span>
                      </div>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                /* ================= CREATE ACCOUNT FORM ================= */
                <motion.form
                  key="register-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleRegisterSubmit}
                  className="space-y-4"
                >
                  {/* Role Selector Pill */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      I want to join as:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRole('volunteer')}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                          selectedRole === 'volunteer'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Heart className="w-4 h-4 text-emerald-600" />
                        <span>Volunteer</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRole('donor')}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                          selectedRole === 'donor'
                            ? 'bg-primary-50 border-primary-500 text-primary-800 shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Sparkles className="w-4 h-4 text-primary-600" />
                        <span>Donor</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRole('user')}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                          selectedRole === 'user'
                            ? 'bg-slate-100 border-slate-400 text-slate-800 shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <UserIcon className="w-4 h-4 text-slate-600" />
                        <span>Member</span>
                      </button>
                    </div>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600">
                        <UserIcon className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600">
                        <Phone className="h-4 w-4" />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Create Password *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full pl-10 pr-11 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Terms note */}
                  <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                    By registering, you agree to Mahamana Hopes Foundation's{' '}
                    <Link to="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>{' '}
                    and <Link to="/privacy-policy" className="text-primary-600 hover:underline">Privacy Policy</Link>.
                  </p>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full group relative overflow-hidden py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-primary-700 hover:from-emerald-700 hover:to-primary-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating your account...</span>
                      </div>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Bottom Support & Security Strip */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>SSL Encrypted & Protected</span>
              </span>
              <a
                href="mailto:mahamanahopes@gmail.com"
                className="flex items-center gap-1 text-slate-500 hover:text-primary-600 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Need assistance? Contact Us</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
