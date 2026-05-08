import { useNavigate } from 'react-router-dom'
import { Heart, MapPin, Star, Trash2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { listingsApi } from '../../api/listingsApi'
import GuestHostLayout from '../../components/layout/GuestHostLayout'
import EmptyState from '../../components/ui/EmptyState'
import { formatCurrency, propertyImage } from '../../utils/formatters'
import { useState } from 'react'

export default function Wishlist() {
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState(()=>JSON.parse(localStorage.getItem('nextstay-wishlist')||'[]'))

  const { data: allRes } = useQuery({ queryKey:['listings','all'], queryFn:listingsApi.getAll })
  const allListings = allRes?.data || []
  const saved = allListings.filter(l=>wishlist.includes(l.id))

  const remove = (id) => {
    const updated = wishlist.filter(x=>x!==id)
    setWishlist(updated)
    localStorage.setItem('nextstay-wishlist', JSON.stringify(updated))
  }

  return (
    <GuestHostLayout role="GUEST">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="page-header">
          <h1 className="page-title">Your Wishlist</h1>
          <p className="page-subtitle">{saved.length} saved {saved.length===1?'property':'properties'}</p>
        </div>

        {saved.length===0 ? (
          <EmptyState icon={Heart} title="Your wishlist is empty"
            description="Save your favourite listings by clicking the heart icon."
            action={<button onClick={()=>navigate('/guest')} className="btn-primary btn-sm">Start exploring</button>}/>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {saved.map((l,idx)=>(
              <div key={l.id} className="property-card">
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img src={propertyImage(l.id||idx)} alt={l.title} className="property-card-img cursor-pointer" onClick={()=>navigate(`/guest/property/${l.id}`)}/>
                  <button onClick={()=>remove(l.id)} className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-all">
                    <Trash2 size={15} className="text-red-500"/>
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm line-clamp-2">{l.title}</h3>
                    <div className="flex items-center gap-1 shrink-0"><Star size={13} className="fill-amber-400 text-amber-400"/><span className="text-xs font-semibold">{l.averageRating?.toFixed(1)||'—'}</span></div>
                  </div>
                  <p className="text-xs text-text-secondary flex items-center gap-1 mb-2"><MapPin size={11}/>{l.location}</p>
                  <p className="text-sm font-bold">{formatCurrency(l.pricePerNight)}<span className="font-normal text-text-secondary"> / night</span></p>
                  <button onClick={()=>navigate(`/guest/property/${l.id}`)} className="mt-3 w-full btn-primary btn-sm">View listing</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GuestHostLayout>
  )
}
