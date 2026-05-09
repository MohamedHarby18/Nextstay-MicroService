import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Star, Users, Calendar, ChevronLeft, Share2, Shield, Wifi, Car, Utensils, Waves } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { listingsApi } from '../../api/listingsApi'
import { reviewsApi } from '../../api/reviewsApi'
import GuestHostLayout from '../../components/layout/GuestHostLayout'
import { SkeletonText } from '../../components/ui/SkeletonLoader'
import StarRating from '../../components/ui/StarRating'
import Avatar from '../../components/ui/Avatar'
import { formatCurrency, formatDate, propertyImage, timeAgo } from '../../utils/formatters'

const AMENITY_ICONS = { WiFi:<Wifi size={18}/>, Parking:<Car size={18}/>, Kitchen:<Utensils size={18}/>, Pool:<Waves size={18}/> }

export default function PropertyDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [imgIdx, setImgIdx] = useState(0)

  const { data: listingRes, isLoading } = useQuery({ queryKey:['listing',id], queryFn:()=>listingsApi.getById(id) })
  const { data: reviews=[] } = useQuery({ queryKey:['reviews','listing',id], queryFn:()=>reviewsApi.getByListing(id) })

  const listing = listingRes?.data
  const nights = checkIn&&checkOut ? Math.max(0,Math.round((new Date(checkOut)-new Date(checkIn))/(1000*60*60*24))) : 0
  const total = nights * (listing?.pricePerNight||0)
  const images = Array.from({length:5},(_,i)=>propertyImage(`${id}-${i}`,800,600))

  const handleBook = () => {
    if (!checkIn||!checkOut) return
    navigate(`/guest/checkout/${id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)
  }

  if (isLoading) return <GuestHostLayout role="GUEST"><div className="max-w-5xl mx-auto px-4 py-8"><SkeletonText lines={8}/></div></GuestHostLayout>
  if (!listing) return <GuestHostLayout role="GUEST"><div className="max-w-5xl mx-auto px-4 py-8 text-center"><p className="text-text-secondary">Listing not found.</p></div></GuestHostLayout>

  return (
    <GuestHostLayout role="GUEST">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={()=>navigate(-1)} className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors">
          <ChevronLeft size={16}/> Back to results
        </button>

        <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{listing.title}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-text-secondary flex-wrap">
              <span className="flex items-center gap-1"><Star size={14} className="fill-amber-400 text-amber-400"/><span className="font-semibold text-text-primary">{listing.averageRating?.toFixed(1)||'New'}</span> · {reviews.length} reviews</span>
              <span className="flex items-center gap-1"><MapPin size={13}/>{listing.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted"><Share2 size={15}/>Share</button>
          </div>
        </div>

        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-80 sm:h-[420px] rounded-3xl overflow-hidden mb-8">
          <div className="col-span-2 row-span-2 relative cursor-pointer" onClick={()=>setImgIdx(0)}>
            <img src={images[0]} alt="" className="w-full h-full object-cover"/>
          </div>
          {images.slice(1,5).map((img,i)=>(
            <div key={i} className="relative cursor-pointer overflow-hidden" onClick={()=>setImgIdx(i+1)}>
              <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between py-6 border-b border-border">
              <div>
                <h2 className="text-xl font-bold text-text-primary">Hosted by a verified host</h2>
                <p className="text-text-secondary text-sm mt-1">Up to {listing.maxGuests} guests · Entire place</p>
              </div>
              <Avatar name="Host" size={52}/>
            </div>

            <div>
              <h3 className="font-semibold text-text-primary mb-3">About this place</h3>
              <p className="text-text-secondary leading-relaxed">{listing.description}</p>
            </div>

            {listing.amenities?.length > 0 && (
              <div>
                <h3 className="font-semibold text-text-primary mb-4">What this place offers</h3>
                <div className="grid grid-cols-2 gap-3">
                  {listing.amenities.map(a=>(
                    <div key={a} className="flex items-center gap-3 py-2">
                      <span className="text-text-secondary">{AMENITY_ICONS[a]||'✓'}</span>
                      <span className="text-text-primary text-sm font-medium">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-3 mb-6">
                <Star size={20} className="fill-amber-400 text-amber-400"/>
                <span className="text-xl font-bold">{listing.averageRating?.toFixed(1)||'—'}</span>
                <span className="text-text-secondary">· {reviews.length} reviews</span>
              </div>
              {reviews.length===0 ? (
                <p className="text-text-secondary text-sm">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {reviews.slice(0,4).map(r=>(
                    <div key={r.id} className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Avatar name="Guest" size={36}/>
                        <div><p className="font-semibold text-sm">Guest</p><p className="text-xs text-text-secondary">{timeAgo(r.createdAt)}</p></div>
                      </div>
                      <StarRating value={r.rating} size={14}/>
                      <p className="text-sm text-text-secondary leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-2xl font-bold">{formatCurrency(listing.pricePerNight)}</span>
                <span className="text-text-secondary">/ night</span>
              </div>

              <div className="border border-border rounded-xl overflow-hidden mb-4">
                <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
                  <div className="px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-text-secondary mb-1">Check-in</p>
                    <input type="date" className="text-sm font-semibold outline-none bg-transparent w-full"
                      value={checkIn} min={new Date().toISOString().split('T')[0]} onChange={e=>setCheckIn(e.target.value)}/>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-text-secondary mb-1">Check-out</p>
                    <input type="date" className="text-sm font-semibold outline-none bg-transparent w-full"
                      value={checkOut} min={checkIn||new Date().toISOString().split('T')[0]} onChange={e=>setCheckOut(e.target.value)}/>
                  </div>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-text-secondary mb-1">Guests</p>
                  <div className="flex items-center gap-3">
                    <button onClick={()=>setGuests(g=>Math.max(1,g-1))} className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-lg hover:bg-muted">−</button>
                    <span className="text-sm font-semibold w-4 text-center">{guests}</span>
                    <button onClick={()=>setGuests(g=>Math.min(listing.maxGuests,g+1))} className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-lg hover:bg-muted">+</button>
                    <span className="text-xs text-text-secondary">(max {listing.maxGuests})</span>
                  </div>
                </div>
              </div>

              <button onClick={handleBook} disabled={!checkIn||!checkOut||nights<=0}
                className="btn-primary w-full mb-4 disabled:opacity-50">
                Reserve
              </button>
              <p className="text-center text-xs text-text-secondary mb-4">You won't be charged yet</p>

              {nights>0 && (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">{formatCurrency(listing.pricePerNight)} × {nights} nights</span>
                    <span className="font-medium">{formatCurrency(listing.pricePerNight*nights)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Service fee</span>
                    <span className="font-medium">{formatCurrency(total*0.12)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-3 border-t border-border">
                    <span>Total</span>
                    <span>{formatCurrency(total*1.12)}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-text-secondary">
                <Shield size={13}/> Booking protected by NextStay
              </div>
            </div>
          </div>
        </div>
      </div>
    </GuestHostLayout>
  )
}