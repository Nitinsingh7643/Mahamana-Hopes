import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ThemeProvider } from './components/ThemeContext';
import { AuthProvider } from './components/AuthContext';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Education from './pages/Education';
import Healthcare from './pages/Healthcare';
import Environment from './pages/Environment';
import Donate from './pages/Donate';
import Volunteer from './pages/Volunteer';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Login from './pages/Login';

// Admin
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminVolunteers from './pages/admin/Volunteers';
import AdminCampaigns from './pages/admin/Campaigns';
import AdminDonations from './pages/admin/Donations';
import AdminUsers from './pages/admin/Users';
import AdminMessages from './pages/admin/Messages';
import AdminImpactStats from './pages/admin/ImpactStats';

// ScrollToTop component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Layout wrapper
function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Temporary placeholder for unbuilt pages
const ComingSoon = ({ title }: { title: string }) => (
  <div className="min-h-[60vh] flex items-center justify-center pt-20">
    <div className="text-center">
      <h1 className="text-3xl font-heading font-bold text-primary-500 mb-4">{title}</h1>
      <p className="text-gray-500">This page is coming soon.</p>
    </div>
  </div>
);

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HelmetProvider>
          <Router>
            <ScrollToTop />
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                
                {/* Domains */}
                <Route path="education" element={<Education />} />
                <Route path="healthcare" element={<Healthcare />} />
                <Route path="environment" element={<Environment />} />
                
                {/* Action Pages */}
                <Route path="donate" element={<Donate />} />
                <Route path="volunteer" element={<Volunteer />} />
                <Route path="contact" element={<Contact />} />
                
                {/* Placeholders */}
                <Route path="our-work" element={<ComingSoon title="Our Work" />} />
                <Route path="impact" element={<ComingSoon title="Impact Dashboard" />} />
                <Route path="campaigns" element={<ComingSoon title="Campaigns" />} />
                <Route path="stories" element={<ComingSoon title="Stories" />} />
                <Route path="stories/:slug" element={<ComingSoon title="Story Detail" />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="partner" element={<ComingSoon title="Partner With Us" />} />
                <Route path="privacy-policy" element={<ComingSoon title="Privacy Policy" />} />
                <Route path="terms" element={<ComingSoon title="Terms & Conditions" />} />
                <Route path="faq" element={<ComingSoon title="FAQ" />} />
                
                <Route path="*" element={<ComingSoon title="404 - Page Not Found" />} />
              </Route>

              {/* Login Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<Login />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="donations" element={<AdminDonations />} />
                <Route path="volunteers" element={<AdminVolunteers />} />
                <Route path="campaigns" element={<AdminCampaigns />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="impact" element={<AdminImpactStats />} />
                <Route path="stories" element={<ComingSoon title="Manage Stories" />} />
                <Route path="gallery" element={<ComingSoon title="Manage Gallery" />} />
              </Route>
            </Routes>
          </Router>
        </HelmetProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
