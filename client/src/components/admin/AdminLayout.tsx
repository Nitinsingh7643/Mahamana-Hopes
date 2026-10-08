import { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Heart, Users, Megaphone, BookOpen, 
  Image as ImageIcon, MessageSquare, BarChart, Settings, LogOut
} from 'lucide-react';

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Donations', path: '/admin/donations', icon: Heart },
  { name: 'Volunteers', path: '/admin/volunteers', icon: Users },
  { name: 'Campaigns', path: '/admin/campaigns', icon: Megaphone },
  { name: 'Stories', path: '/admin/stories', icon: BookOpen },
  { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
  { name: 'Impact Stats', path: '/admin/impact', icon: BarChart },
  { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
  { name: 'Users', path: '/admin/users', icon: Settings },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('mhf_token');
    const userStr = localStorage.getItem('mhf_user');
    
    if (!token || !userStr) {
      navigate('/admin/login');
      return;
    }
    
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        navigate('/admin/login');
      }
    } catch {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('mhf_token');
    localStorage.removeItem('mhf_user');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-primary-800 text-white flex flex-col shadow-xl flex-shrink-0 z-20">
        <div className="h-16 flex items-center px-6 bg-primary-900 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-primary-900 font-bold text-xl">M</div>
            <span className="font-heading font-bold text-lg group-hover:text-green-400 transition-colors">Admin Panel</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3 space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary-600 text-white' 
                      : 'text-white/70 hover:bg-primary-700 hover:text-white'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-green-400' : 'text-white/50'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 bg-primary-900 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-white/70 rounded-lg hover:bg-primary-800 hover:text-white transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-white/50" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 shrink-0 z-10">
          <h1 className="text-xl font-heading font-bold text-gray-800 capitalize">
            {location.pathname.split('/').pop()?.replace('-', ' ')}
          </h1>
          <div className="flex items-center gap-4">
            <Link to="/" target="_blank" className="text-sm text-primary-600 font-medium hover:underline">
              View Website
            </Link>
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
