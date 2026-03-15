import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, ScanText, Mic2, Briefcase,
  PenLine, TrendingUp, User, LogOut, Zap, Crown
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { authAPI } from '../../services/api'
import toast from 'react-hot-toast'

const nav = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/resumes',      icon: FileText,         label: 'Resumes' },
  { to: '/ats',          icon: ScanText,         label: 'ATS Checker' },
  { to: '/interviews',   icon: Mic2,             label: 'Interviews' },
  { to: '/job-match',    icon: Briefcase,        label: 'Job Match' },
  { to: '/cover-letter', icon: PenLine,          label: 'Cover Letter' },
  { to: '/progress',     icon: TrendingUp,       label: 'Progress' },
  { to: '/profile',      icon: User,             label: 'Profile' },
]

export default function Sidebar() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await authAPI.logout() } catch {}
    clearAuth()
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-dark-950 border-r border-dark-200/10 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-dark-200/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-dark-950" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg text-white tracking-tight">CareerForge</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                : 'text-dark-200/70 hover:text-white hover:bg-dark-800/60'
            }`
          }>
            <Icon size={17} strokeWidth={1.8} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Upgrade banner */}
      <div className="px-4 pb-3">
        <NavLink to="/pricing"
          className={({ isActive }) =>
            `flex items-center gap-3 w-full px-3 py-3 rounded-xl border transition-all duration-150 ${
              isActive
                ? 'bg-brand-500/20 border-brand-500/40 text-brand-300'
                : 'bg-brand-500/8 border-brand-500/20 text-brand-400 hover:bg-brand-500/15 hover:border-brand-500/30'
            }`
          }>
          <Crown size={17} strokeWidth={1.8} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-display font-semibold">Upgrade to Pro</p>
            <p className="text-xs text-dark-200/40 font-normal">Unlimited everything</p>
          </div>
        </NavLink>
      </div>

      {/* User */}
      <div className="p-4 border-t border-dark-200/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-display font-bold text-sm">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-dark-200/50 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-dark-200/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150">
          <LogOut size={17} strokeWidth={1.8} />
          Logout
        </button>
      </div>
    </aside>
  )
}
