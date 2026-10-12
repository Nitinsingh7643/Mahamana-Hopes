import { Link } from 'react-router-dom';
import { Heart, Mail, MapPin, Phone, ArrowUp } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import logoUrl from '../assets/logo.png';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing to our newsletter!');
      setEmail('');
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-primary-500 text-white relative pb-20 lg:pb-0">
      {/* Wave Top */}
      <div className="wave-divider -mb-1">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 28C840 36 960 42 1080 40C1200 38 1320 28 1380 23L1440 18V60H0Z" fill="#1e3a5f" />
        </svg>
      </div>

      <div className="container-max py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* About Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5 group">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center p-1 shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                <img src={logoUrl} alt="Mahamana Hopes Foundation Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-heading font-bold text-lg block leading-tight text-white">Mahamana Hopes</span>
                <span className="text-[10px] tracking-[0.15em] uppercase text-green-300 font-semibold">Foundation</span>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-5">
              A registered trust committed to creating sustainable social impact through education, healthcare, and environmental conservation. Changing Lives, Creating Hopes. Founded on 04-07-2026.
            </p>
            <div className="flex gap-3">
              {[
                { label: 'Facebook' },
                { label: 'Twitter' },
                { label: 'Instagram' },
                { label: 'LinkedIn' },
                { label: 'YouTube' },
              ].map(({ label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-green-500 hover:text-white transition-all duration-300 text-xs font-bold"
                >
                  {label[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-heading font-semibold text-base mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', path: '/about' },
                { label: 'Our Work', path: '/our-work' },
                { label: 'Campaigns', path: '/campaigns' },
                { label: 'Impact', path: '/impact' },
                { label: 'Volunteer', path: '/volunteer' },
                { label: 'Donate', path: '/donate' },
                { label: 'Contact', path: '/contact' },
              ].map(({ label, path }) => (
                <li key={path}>
                  <Link to={path} className="text-white/60 text-sm hover:text-green-300 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Domains */}
          <div>
            <h4 className="text-white font-heading font-semibold text-base mb-5">Our Domains</h4>
            <ul className="space-y-2.5">
              {[
                { label: '📚 Education', path: '/education' },
                { label: '🏥 Healthcare', path: '/healthcare' },
                { label: '🌿 Environment', path: '/environment' },
              ].map(({ label, path }) => (
                <li key={path}>
                  <Link to={path} className="text-white/60 text-sm hover:text-green-300 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-white font-heading font-semibold text-base mb-4 mt-8">Legal & Access</h4>
            <ul className="space-y-2.5">
              <li><Link to="/privacy-policy" className="text-white/60 text-sm hover:text-green-300 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-white/60 text-sm hover:text-green-300 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/faq" className="text-white/60 text-sm hover:text-green-300 transition-colors">FAQ</Link></li>
              <li><Link to="/login" className="text-green-300/80 text-xs font-semibold hover:text-green-300 transition-colors flex items-center gap-1 mt-1">Staff & Admin Portal →</Link></li>
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="text-white font-heading font-semibold text-base mb-5">Get In Touch</h4>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 mt-0.5 text-green-300 shrink-0" />
                <a href="mailto:mahamanahopes@gmail.com" className="text-white/60 text-sm hover:text-green-300 transition-colors">
                  mahamanahopes@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 mt-0.5 text-green-300 shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <a href="tel:+919519059105" className="text-white/60 text-sm hover:text-green-300 transition-colors">+91 95190 59105</a>
                  <a href="tel:+919569085345" className="text-white/60 text-sm hover:text-green-300 transition-colors">+91 95690 85345</a>
                  <a href="tel:+919651082598" className="text-white/60 text-sm hover:text-green-300 transition-colors">+91 96510 82598</a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-green-300 shrink-0" />
                <span className="text-white/60 text-sm">India</span>
              </li>
            </ul>

            <h4 className="text-white font-heading font-semibold text-base mb-3">Newsletter</h4>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="flex-1 px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:border-green-400"
              />
              <button type="submit" className="px-4 py-2.5 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-semibold transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-7 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Mahamana Hopes Foundation. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span>for a better tomorrow</span>
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        className="absolute right-6 bottom-24 lg:bottom-6 w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
}
