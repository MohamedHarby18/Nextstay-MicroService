import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { authApi } from '../../api/authApi'
import { useAuthStore } from '../../store/authStore'
import { usersApi } from '../../api/usersApi'
import toast from 'react-hot-toast'

export default function GuestHostLogin() {
  const navigate = useNavigate()
  const { login, setUser } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authApi.login(form)
      login(res, 'user')
      // fetch user profile
      try {
        const profile = await usersApi.getById(res.userId)
        setUser(profile)
      } catch {}
      toast.success('Welcome back!')
      if (res.role === 'HOST') navigate('/host')
      else navigate('/guest')
    } catch (err) {
      console.error('Login error:', err)
      if (!err.response) {
        toast.error('Cannot reach the server. Make sure the backend is running (docker compose up).')
      } else {
        toast.error(err.response.data?.message || err.response.data?.error || 'Invalid credentials. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — hero image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://picsum.photos/seed/nextstay-hero/1200/900" alt="Stay"
          className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/80 to-black/60" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-2xl font-bold">NextStay</span>
          </div>
          <h2 className="text-4xl font-bold mb-3">Find your perfect place to stay</h2>
          <p className="text-white/80 text-lg max-w-md">
            Discover unique homes and experiences around the world — or start hosting and earn extra income.
          </p>
          <div className="flex gap-4 mt-8">
            {['500K+', '150+', '4.8★'].map((stat, i) => (
              <div key={i} className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 text-center">
                <div className="text-2xl font-bold">{stat}</div>
                <div className="text-xs text-white/70">{['Listings','Countries','Rating'][i]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="text-xl font-bold text-brand-500">NextStay</span>
          </div>

          <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome back</h1>
          <p className="text-text-secondary mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input type="email" className="input" placeholder="you@example.com" required
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} className="input pr-12" placeholder="••••••••" required
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text-secondary transition-colors">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full">
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : (
                <><span>Sign in</span><ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-3 text-center text-sm">
            <p className="text-text-secondary">
              New guest?{' '}
              <Link to="/register/guest" className="text-brand-500 font-semibold hover:underline">Create guest account</Link>
            </p>
            <p className="text-text-secondary">
              Want to host?{' '}
              <Link to="/register/host" className="text-brand-500 font-semibold hover:underline">Become a host</Link>
            </p>
            <div className="divider" />
            <p className="text-text-secondary">
              Employee?{' '}
              <Link to="/employee-login" className="text-text-secondary font-semibold hover:underline hover:text-text-primary">
                Sign in here →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}