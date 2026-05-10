import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Calendar, Users, Star, ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { listingsApi } from '../../api/listingsApi'
import { reservationsApi } from '../../api/reservationsApi'
import GuestHostLayout from '../../components/layout/GuestHostLayout'
import { SkeletonCard } from '../../components/ui/SkeletonLoader'
import { formatCurrency, propertyImage } from '../../utils/formatters'
import { useAuthStore } from '../../store/authStore'

export default function GuestExplore() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [search, setSearch] = useState({ location:'', checkIn:'', checkOut:'', guests:1 })

  const { data: listingsRes, isLoading } = useQuery({
    queryKey: ['listings', 'all'],
    queryFn: listingsApi.getAll,
  })
  const { data: reservations } = useQuery({
    queryKey: ['reservations', 'my'],
    queryFn: reservationsApi.getMy,
  })

  const listings = (listingsRes?.data || []).filter(l => l.status === 'ACTIVE')
  const recent = reservations?.slice(0,3) || []

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/guest/search?location=${encodeURIComponent(search.location)}&guests=${search.guests}&checkIn=${search.checkIn}&checkOut=${search.checkOut}`)
  }

  return (
    <GuestHostLayout role="GUEST">
      <div className="bg-gradient-to-b from-rose-50 to-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-text-primary mb-2 text-center">
            Find your next <span className="text-brand-500">perfect stay</span>
          </h1>
          <p className="text-text-secondary text-center mb-8">Discover unique homes, apartments and villas around the world</p>

          <form onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-card border border-border p-2 flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-3 flex-1 px-4 py-3 border-b sm:border-b-0 sm:border-r border-border">
              <MapPin size={18} className="text-brand-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-0.5">Where</p>
                <input className="w-full text-sm font-medium outline-none placeholder:text-text-light" placeholder="Search destinations"
                  value={search.location} onChange={e=>setSearch({...search,location:e.target.value})} />
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-border">
              <Calendar size={18} className="text-brand-500 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-0.5">Check in</p>
                <input type="date" className="text-sm font-medium outline-none bg-transparent"
                  value={search.checkIn} onChange={e=>setSearch({...search,checkIn:e.target.value})} />
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-border">
              <Calendar size={18} className="text-brand-500 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-0.5">Check out</p>
                <input type="date" className="text-sm font-medium outline-none bg-transparent"
                  value={search.checkOut} onChange={e=>setSearch({...search,checkOut:e.target.value})} />
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Users size={18} className="text-brand-500 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-0.5">Guests</p>
                <input type="number" min="1" max="20" className="w-16 text-sm font-medium outline-none bg-transparent"
                  value={search.guests} onChange={e=>setSearch({...search,guests:e.target.value})} />
              </div>
            </div>
            <button type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-all active:scale-95 shrink-0">
              <Search size={18} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {recent.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text-primary">Your recent stays</h2>
              <button onClick={()=>navigate('/guest/reservations')} className="text-sm text-brand-500 font-semibold flex items-center gap-1 hover:underline">
                View all <ArrowRight size={14}/>
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {recent.map(r => (
                <div key={r.id} onClick={()=>navigate(`/guest/reservations/${r.id}`)}
                  className="shrink-0 w-64 card-hover p-4 cursor-pointer">
                  <p className="text-xs text-text-secondary font-medium mb-1">{r.checkInDate} → {r.checkOutDate}</p>
                  <p className="text-sm font-semibold text-text-primary truncate">{r.listingId}</p>
                  <span className={`badge mt-2 ${r.status==='CONFIRMED'?'badge-blue':r.status==='COMPLETED'?'badge-green':r.status==='PENDING'?'badge-yellow':'badge-gray'}`}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-primary">
            {isLoading ? 'Loading...' : `${listings.length} places to stay`}
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({length:8}).map((_,i)=><SkeletonCard key={i}/>)}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-secondary text-lg">No listings available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing, idx) => (
              <div key={listing.id} className="property-card" onClick={()=>navigate(`/guest/property/${listing.id}`)}>
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img src={propertyImage(listing.id || idx, 600, 400)} alt={listing.title}
                    className="property-card-img" />
                  <div className="absolute bottom-3 left-3 bg-white/95 text-xs font-bold px-2 py-1 rounded-full text-text-primary">
                    {listing.status}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-text-primary text-sm leading-tight line-clamp-2">{listing.title}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star size={13} className="fill-amber-400 text-amber-400"/>
                      <span className="text-xs font-semibold">{listing.averageRating?.toFixed(1) || '—'}</span>
                    </div>
                  </div>
                  <p className="text-text-secondary text-xs flex items-center gap-1 mb-2">
                    <MapPin size={11} className="shrink-0"/>{listing.location}
                  </p>
                  {listing.amenities?.length > 0 && (
                    <p className="text-xs text-text-light mb-2 truncate">{listing.amenities.slice(0,3).join(' · ')}</p>
                  )}
                  <p className="text-sm font-bold text-text-primary">
                    {formatCurrency(listing.pricePerNight)}<span className="font-normal text-text-secondary"> / night</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GuestHostLayout>
  )
}