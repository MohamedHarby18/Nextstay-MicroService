import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, ChevronDown, ChevronRight } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import Avatar from '../ui/Avatar'
import { clsx } from 'clsx'

// Role-specific sidebar configs
const SIDEBARS = {
  SUPPORT_AGENT: {
    label:  'Support Agent',
    bg:     'bg-agent-500',
    accent: '#52B788',
    links: [
      { label: 'Ticket Queue',    to: '/agent/tickets',         icon: '🎫' },
      { label: 'Action Needed',   to: '/agent/action-needed',   icon: '⚡' },
      { label: 'Flagged Reviews', to: '/agent/flagged-reviews', icon: '🚩' },
      { label: 'Resolution Log',  to: '/agent/history',         icon: '✅' },
      { label: 'My Performance',  to: '/agent/performance',     icon: '📊' },
    ],
  },
  SUPPORT_LEAD: {
    label:  'Support Lead',
    bg:     'bg-agent-500',
    accent: '#52B788',
    links: [
      { label: 'Ticket Queue',    to: '/agent/tickets',         icon: '🎫' },
      { label: 'Assign Tickets',  to: '/emp-admin/assign',      icon: '📋' },
      { label: 'Action Needed',   to: '/agent/action-needed',   icon: '⚡' },
      { label: 'Flagged Reviews', to: '/agent/flagged-reviews', icon: '🚩' },
      { label: 'Resolution Log',  to: '/agent/history',         icon: '✅' },
      { label: 'My Performance',  to: '/agent/performance',     icon: '📊' },
    ],
  },
  ADMIN_USERS: {
    label:  "Users' Admin",
    bg:     'bg-usersAdmin-500',
    accent: '#E94560',
    links: [
      { label: 'User Management',    to: '/users-admin/users',    icon: '👥' },
      { label: 'Host Reviews',       to: '/users-admin/reviews',  icon: '⭐' },
      { label: 'Refund Requests',    to: '/users-admin/refunds',  icon: '💳' },
      { label: 'Property Approvals', to: '/users-admin/listings', icon: '🏠' },
    ],
  },
  ADMIN_EMPLOYEES: {
    label:  "Employees' Admin",
    bg:     'bg-empAdmin-500',
    accent: '#F39C12',
    links: [
      { label: 'Employees',         to: '/emp-admin/employees',    icon: '🧑‍💼' },
      { label: 'Assign Tickets',    to: '/emp-admin/assign',       icon: '📋' },
      { label: 'Action Needed',     to: '/emp-admin/action-needed',icon: '⚡' },
    ],
  },
}

export default function EmployeeLayout({ children, sidebarRole }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user, role } = useAuthStore()
  const [profileOpen, setProfileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const config = SIDEBARS[sidebarRole] || SIDEBARS.SUPPORT_AGENT

  const handleLogout = () => { 
    logout(); 
    if (sidebarRole === 'ADMIN_USERS') {
      navigate('/login');
    } else {
      navigate('/employee-login');
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ── Sidebar ── */}
            <aside className={clsx(
              'flex flex-col transition-all duration-300 shrink-0 relative z-40', // <-- Added relative and z-40
              config.bg,
              collapsed ? 'w-16' : 'w-64'
            )}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 shrink-0">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">N</span>
              </div>
              <span className="text-white font-bold text-base">NextStay</span>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white ml-auto">
            {collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} className="rotate-90" />}
          </button>
        </div>

        {/* Role label */}
        {!collapsed && (
          <div className="px-4 mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/50">{config.label}</span>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
          {config.links.map(link => {
            const active = location.pathname === link.to || location.pathname.startsWith(link.to + '/')
            return (
              <Link key={link.to} to={link.to}
                title={collapsed ? link.label : undefined}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  active ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/10',
                  collapsed && 'justify-center'
                )}>
                <span className="text-base shrink-0">{link.icon}</span>
                {!collapsed && link.label}
              </Link>
            )
          })}
        </nav>

        {/* Profile section at bottom */}
        <div className="px-2 py-4 shrink-0 border-t border-white/10 relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors',
              collapsed && 'justify-center'
            )}
          >
            <Avatar name={user?.name || role} size={32} />
            {!collapsed && (
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.name || 'Agent'}</p>
                <p className="text-xs text-white/50 truncate">{config.label}</p>
              </div>
            )}
          </button>

          {profileOpen && !collapsed && (
            <div className="absolute bottom-full left-2 right-2 mb-2 bg-white rounded-2xl shadow-modal overflow-hidden animate-fade-in">
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors">
                <LogOut size={15} />
                Log out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
          <div />
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary font-medium">{config.label}</span>
            <Avatar name={user?.name || role} size={32} />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {profileOpen && <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />}
    </div>
  )
}