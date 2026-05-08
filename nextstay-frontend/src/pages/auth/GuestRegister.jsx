import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import { authApi } from '../../api/authApi'
import toast from 'react-hot-toast'

export default function GuestRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phoneNumber: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authApi.register({ name: form.name, email: form.email, password: form.password, role: 'GUEST' })
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      console.error('Registration error:', err)
      if (!err.response) {
        toast.error('Cannot reach the server. Make sure the backend is running (docker compose up).')
      } else {
        toast.error(err.response.data?.message || err.response.data?.error || `Registration failed (${err.response.status})`)
      }
    } finally {
      setLoading(false)
    }
  }

  const perks = ['Free to join', 'Instant booking', 'Secure payments', '24/7 support']

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-guest-50 flex-col justify-center px-12 py-16">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">N</span>
          </div>
          <span className="text-xl font-bold text-brand-500">NextStay</span>
        </div>
        <h2 className="text-4xl font-bold text-text-primary mb-4">Join millions of travelers</h2>
        <p className="text-text-secondary text-lg mb-10">
          Discover unique places to stay, from cozy apartments to luxury villas.
        </p>
        <div className="space-y-3">
          {perks.map(p => (
            <div key={p} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center shrink-0">
                <Check size={13} className="text-white" />
              </div>
              <span className="text-text-primary font-medium">{p}</span>
            </div>
          ))}
        </div>
        <img src="https://picsum.photos/seed/guest-register/600/300" alt=""
          className="mt-12 rounded-3xl shadow-card-hover object-cover h-48 w-full" />
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="text-xl font-bold text-brand-500">NextStay</span>
          </div>

          <h1 className="text-3xl font-bold text-text-primary mb-2">Create guest account</h1>
          <p className="text-text-secondary mb-8">It's free and takes less than a minute</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <input type="text" className="input" placeholder="Jane Doe" required
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Email address</label>
              <input type="email" className="input" placeholder="jane@example.com" required
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Phone number <span className="text-text-light font-normal">(optional)</span></label>
              <input type="tel" className="input" placeholder="+1 555 000 0000"
                value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} className="input pr-12" placeholder="At least 8 characters" required minLength={8}
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text-secondary">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading
                ? <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                : <><span>Create account</span><ArrowRight size={18} /></>
              }
            </button>

            <p className="text-xs text-text-secondary text-center">
              By signing up you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>
            </p>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 font-semibold hover:underline">Sign in</Link>
          </p>
          <p className="text-center text-sm text-text-secondary mt-2">
            Want to host?{' '}
            <Link to="/register/host" className="text-brand-500 font-semibold hover:underline">Become a host</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
