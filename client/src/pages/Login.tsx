import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Lock, Mail, User as UserIcon, Phone, ArrowRight, Eye, EyeOff 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuth } from '../components/AuthContext';
import logoUrl from '../assets/logo.png';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Check if routed from /admin/login
  const isAdminLoginPath = location.pathname.includes('/admin/login');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data } = await authAPI.register({
        name,
        email,
        password,
        phone,
      });

      if (data.success) {
        login(data.token, data.user);
        toast.success(`Account created! Welcome to Mahamana Hopes, ${data.user.name}.`);
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/40 flex flex-col justify-center py-16 sm:px-6 lg:px-8">
      <Helmet>
        <title>{isRegister ? 'Register' : 'Sign In'} — Mahamana Hopes Foundation</title>
      </Helmet>

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 group mb-4">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center p-1 shadow-md group-hover:scale-105 transition-transform overflow-hidden border border-gray-100">
            <img src={logoUrl} alt="Mahamana Hopes Logo" className="w-full h-full object-contain" />
          </div>
          <div className="text-left">
            <span className="font-heading font-bold text-xl block leading-tight text-primary-900">
              Mahamana Hopes
            </span>
            <span className="text-[11px] tracking-[0.15em] uppercase text-emerald-600 font-bold">
              Foundation
            </span>
          </div>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mt-2">
          {isAdminLoginPath 
            ? 'Administrator Portal' 
            : isRegister ? 'Join Our Community' : 'Sign in to your account'}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {isRegister
            ? 'Connect with initiatives, register as a volunteer, and support causes.'
            : 'Access dashboard, volunteer programs, and campaign management.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-5 sm:px-10 shadow-xl rounded-2xl border border-gray-100">
          
          {/* Sign In vs Register Tabs (if not on strict /admin/login) */}
          {!isAdminLoginPath && (
            <div className="flex border-b border-gray-100 mb-6 pb-2 gap-4">
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className={`pb-2 text-sm font-semibold transition-all relative ${
                  !isRegister
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className={`pb-2 text-sm font-semibold transition-all relative ${
                  isRegister
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Create Account
              </button>
            </div>
          )}


          {/* Login Form */}
          {!isRegister ? (
            <form className="space-y-5" onSubmit={handleLoginSubmit}>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="e.g. admin@mahamanahopes.org"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form className="space-y-4" onSubmit={handleRegisterSubmit}>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                <div className="relative">
                  <UserIcon className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. Priya Sharma"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
                    placeholder="priya@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
                    placeholder="Minimum 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition-all cursor-pointer disabled:opacity-70 mt-2"
              >
                {isSubmitting ? 'Creating account...' : 'Create Account'}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <Link to="/" className="text-xs font-medium text-gray-500 hover:text-primary-600 transition-colors">
              ← Return to Mahamana Hopes Foundation Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
