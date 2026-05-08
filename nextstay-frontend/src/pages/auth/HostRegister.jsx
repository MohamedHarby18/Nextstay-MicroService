import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, Home, DollarSign, Calendar } from 'lucide-react'
import { authApi } from '../../api/authApi'
import { useAuthStore } from '../../store/authStore'
import { listingsApi } from '../../api/listingsApi'
import toast from 'react-hot-toast'

const AMENITIES = ['WiFi', 'Air conditioning', 'Kitchen', 'Parking', 'Pool', 'Gym', 'Pet friendly', 'Washer/Dryer']

export default function HostRegister() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [step, setStep] = useState(1)
  const [account, setAccount] = useState({ name: '', email: '', password: '', phoneNumber: '' })
  const [listing, setListing] = useState({ title: '', description: '', location: '', pricePerNight: '', maxGuests: 2, amenities: [] })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAccountSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      await authApi.register({ name: account.name, email: account.email, password: account.password, role: 'HOST' })
      const authRes = await authApi.login({ email: account.email, password: account.password })
      login(authRes, 'user')
      toast.success('Account created! Now create your first listing.')
      setStep(2)
    } catch (err) {
      console.error('Registration error:', err)
      if (!err.response) {
        toast.error('Cannot reach the server. Make sure the backend is running (docker compose up).')
      } else {
        toast.error(err.response.data?.message || err.response.data?.error || `Registration failed (${err.response.status})`)
      }
    }
    finally { setLoading(false) }
  }

  const toggleAmenity = (a) => setListing(prev => ({ ...prev, amenities: prev.amenities.includes(a) ? prev.amenities.filter(x => x !== a) : [...prev.amenities, a] }))

  const handleListingSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      await listingsApi.create({ title: listing.title, description: listing.description, location: listing.location, pricePerNight: parseFloat(listing.pricePerNight), maxGuests: parseInt(listing.maxGuests), amenities: listing.amenities })
      toast.success('Listing created! Welcome to NextStay hosting.')
    } catch { toast.error('Listing failed, but your account is ready.') }
    finally { setLoading(false); navigate('/host') }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-5/12 bg-host-500 flex-col justify-center px-12 py-16">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center"><span className="text-white font-bold">N</span></div>
          <span className="text-xl font-bold text-white">NextStay</span>
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">Start earning as a host</h2>
        <p className="text-white/70 text-lg mb-10">Share your space and earn extra income — on your schedule.</p>
        <div className="space-y-4">
          {[{ i: Home, t: 'List your property in minutes' }, { i: DollarSign, t: 'Set your own price' }, { i: Calendar, t: 'Control your availability' }].map(({ i: Icon, t }) => (
            <div key={t} className="flex items-center gap-3 bg-white/10 rounded-2xl p-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Icon size={20} className="text-white" /></div>
              <span className="text-white font-medium">{t}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-12">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-white text-host-500' : 'bg-white/20 text-white'}`}>{s}</div>
              {s < 2 && <div className={`h-0.5 w-8 ${step > s ? 'bg-white' : 'bg-white/20'}`} />}
            </div>
          ))}
          <span className="text-white/70 text-sm ml-2">{step === 1 ? 'Create account' : 'First listing'}</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-lg">
          {step === 1 ? (
            <>
              <h1 className="text-3xl font-bold mb-2">Create host account</h1>
              <p className="text-text-secondary mb-8">Step 1 of 2 — Your account details</p>
              <form onSubmit={handleAccountSubmit} className="space-y-4">
                <div><label className="label">Full name</label><input type="text" className="input" placeholder="Your name" required value={account.name} onChange={e => setAccount({ ...account, name: e.target.value })} /></div>
                <div><label className="label">Email</label><input type="email" className="input" placeholder="host@example.com" required value={account.email} onChange={e => setAccount({ ...account, email: e.target.value })} /></div>
                <div><label className="label">Phone</label><input type="tel" className="input" placeholder="+1 555 000 0000" value={account.phoneNumber} onChange={e => setAccount({ ...account, phoneNumber: e.target.value })} /></div>
                <div><label className="label">Password</label>
                  <div className="relative">
                    <input type={show ? 'text' : 'password'} className="input pr-12" placeholder="Min. 8 characters" required minLength={8} value={account.password} onChange={e => setAccount({ ...account, password: e.target.value })} />
                    <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creating...' : <><span>Continue</span><ArrowRight size={18} /></>}</button>
              </form>
              <p className="text-center text-sm text-text-secondary mt-6">Already a host? <Link to="/login" className="text-brand-500 font-semibold hover:underline">Sign in</Link></p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2">Create your first listing</h1>
              <p className="text-text-secondary mb-8">Step 2 of 2 — Tell guests about your property</p>
              <form onSubmit={handleListingSubmit} className="space-y-4">
                <div><label className="label">Listing title</label><input type="text" className="input" placeholder="Cozy apartment in city center" required value={listing.title} onChange={e => setListing({ ...listing, title: e.target.value })} /></div>
                <div><label className="label">Description</label><textarea rows={3} className="input resize-none" placeholder="Describe your property..." required value={listing.description} onChange={e => setListing({ ...listing, description: e.target.value })} /></div>
                <div><label className="label">Location</label><input type="text" className="input" placeholder="City, Country" required value={listing.location} onChange={e => setListing({ ...listing, location: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="label">Price / night ($)</label><input type="number" className="input" placeholder="99" min="1" required value={listing.pricePerNight} onChange={e => setListing({ ...listing, pricePerNight: e.target.value })} /></div>
                  <div><label className="label">Max guests</label><input type="number" className="input" min="1" max="20" value={listing.maxGuests} onChange={e => setListing({ ...listing, maxGuests: e.target.value })} /></div>
                </div>
                <div>
                  <label className="label">Amenities</label>
                  <div className="flex flex-wrap gap-2">
                    {AMENITIES.map(a => (
                      <button type="button" key={a} onClick={() => toggleAmenity(a)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${listing.amenities.includes(a) ? 'bg-brand-500 text-white border-brand-500' : 'border-border text-text-secondary hover:border-gray-400'}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => navigate('/host')} className="btn-secondary flex-1">Skip for now</button>
                  <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Creating...' : 'Create listing'}</button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
