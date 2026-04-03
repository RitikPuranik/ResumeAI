import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard, FileText, Mic2, CreditCard,
  User, LogOut, Sparkles, Menu, X, Target, Brain, Mail, TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/resumes',      icon: FileText,         label: 'Resumes' },
  { to: '/interview',    icon: Mic2,             label: 'Interview Prep' },
  { to: '/ats',          icon: Target,           label: 'ATS Checker' },
  { to: '/jobmatch',     icon: Brain,            label: 'Job Match' },
  { to: '/coverletter',  icon: Mail,             label: 'Cover Letter' },
  { to: '/progress',     icon: TrendingUp,       label: 'Progress' },
  { to: '/pricing',      icon: CreditCard,       label: 'Plans' },
  { to: '/profile',      icon: User,             label: 'Profile' },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-cream-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sage-500 flex items-center justify-center shadow-sm">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg font-semibold text-charcoal-800 leading-none">ResumeAI</h1>
            <p className="text-xs text-sage-400 mt-0.5">Career Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-sage-500 text-white shadow-sm'
                  : 'text-sage-600 hover:bg-cream-100 hover:text-charcoal-800'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-cream-200">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center">
            <span className="text-xs font-semibold text-sage-600">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-charcoal-800 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-sage-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-500 transition-all duration-150"
        >
          <LogOut size={17} /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-cream-100 overflow-hidden">
      <aside className="hidden md:flex w-60 bg-white border-r border-cream-200 flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-60 bg-white shadow-xl z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-cream-200">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-cream-100">
            <Menu size={20} className="text-charcoal-800" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sage-500 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-display font-semibold text-charcoal-800">ResumeAI</span>
          </div>
          <div className="w-9" />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}