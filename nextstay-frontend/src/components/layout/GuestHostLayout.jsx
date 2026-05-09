import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Globe, Menu, Bell, ChevronDown, Heart, MessageSquare } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import Avatar from '../ui/Avatar'

const GUEST_NAV = [
  { label: 'Explore',      to: '/guest' },
  { label: 'Reservations', to: '/guest/reservations' },
  { label: 'Reviews',      to: '/guest/reviews' },
  { label: 'Support',      to: '/guest/tickets' },
]
const HOST_NAV = [
  { label: 'Dashboard',    to: '/host' },
  { label: 'Listings',     to: '/host/listings' },
  { label: 'Bookings',     to: '/host/bookings' },
  { label: 'Reviews',      to: '/host/reviews' },
  { label: 'Earnings',     to: '/host/earnings' },
  { label: 'Support',      to: '/host/tickets' },
]

export default function GuestHostLayout({ children, role }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const nav = role === 'HOST' ? HOST_NAV : GUEST_NAV

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Topbar ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={role === 'HOST' ? '/host' : '/guest'} className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <span className="font-bold text-lg text-brand-500 hidden sm:block">NextStay</span>
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {nav.map(item => (
              <Link key={item.to} to={item.to}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.to || location.pathname.startsWith(item.to + '/')
                    ? 'text-brand-500 bg-brand-50' : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                }`}>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted transition-colors text-sm font-medium text-text-secondary">
              <Globe size={15} />
            </button>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 border border-border rounded-full px-3 py-2 hover:shadow-md transition-all duration-200"
              >
                <Menu size={16} className="text-text-secondary" />
                <Avatar name={user?.name || 'User'} size={28} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-modal border border-border overflow-hidden z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="font-semibold text-sm text-text-primary">{user?.name || 'User'}</p>
                    <p className="text-xs text-text-secondary">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to={role === 'HOST' ? '/host/profile' : '/guest/profile'}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-text-primary hover:bg-muted transition-colors"
                    >
                      Go to Profile
                    </Link>
                    {role === 'HOST' && (
                      <Link to="/guest" onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-text-secondary hover:bg-muted transition-colors">
                        Switch to Guest
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="min-h-[calc(100vh-64px)]">{children}</main>

      {/* Overlay to close menu */}
      {menuOpen && <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />}
    </div>
  )
}
