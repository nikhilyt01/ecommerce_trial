import { useState, useLocation } from 'react'; // Import useLocation
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom'; 
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart,
  Users,
  Settings, 
  Menu, 
  X,
  Bell,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MainLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if unauthenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    ...(isAdmin ? [{ name: 'Analytics Dashboard', path: '/', icon: LayoutDashboard }] : []),
    { name: 'Products Management', path: '/products', icon: ShoppingBag },
    // PLACEHOLDERS: Showing domain architecture without heavy logic
    { name: 'Orders Log', path: '#', icon: ShoppingCart, disabled: true },
    { name: 'Customers Base', path: '#', icon: Users, disabled: true },
    { name: 'System Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-secondary-bg flex">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col bg-primary-bg border-r border-gray-200 transition-transform duration-300
          w-64 md:w-20 lg:w-64 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 text-primary-text">
          <span className="font-bold text-xl tracking-tight md:hidden lg:block">NKS Ecommerce</span>
          <span className="font-bold text-xl tracking-tight hidden md:block lg:hidden mx-auto text-primary-text">NKS</span>
          <button 
            className="md:hidden text-muted hover:text-primary-text"
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            if (item.disabled) {
              return (
                <div
                  key={item.name}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 cursor-not-allowed opacity-60"
                  title="Coming Soon"
                >
                  <item.icon size={20} className="shrink-0" />
                  <span className="font-medium md:hidden lg:block flex-1">{item.name}</span>
                  <span className="md:hidden lg:block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-gray-200 rounded">Soon</span>
                </div>
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                  ${isActive ? 'bg-gray-100 text-primary-text font-semibold border-l-2 border-primary-text rounded-l-none' : 'text-muted hover:bg-gray-50 hover:text-primary-text'}
                `}
                onClick={() => setIsMobileOpen(false)}
              >
                <item.icon size={20} className="shrink-0" />
                <span className="font-medium md:hidden lg:block">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Profile Action */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 w-full px-3 py-2 text-primary-text rounded-md mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="font-bold text-blue-600">{currentUser?.username?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 md:hidden lg:block truncate overflow-hidden">
              <p className="font-medium truncate">{currentUser?.username}</p>
              <p className="text-xs text-muted capitalize">{currentUser?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut size={20} className="shrink-0" />
            <span className="font-medium md:hidden lg:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-20 lg:ml-64 transition-all duration-300">
        {/* Topbar */}
        <header className="h-16 bg-primary-bg border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-muted hover:text-primary-text"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button className="text-muted hover:text-primary-text relative p-2">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content (Injected by React Router's Outlet) */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}