import { useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Shield, CreditCard, Calendar, Users, MapPin } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { listingsApi } from '../../api/listingsApi'
import { reservationsApi } from '../../api/reservationsApi'
import GuestHostLayout from '../../components/layout/GuestHostLayout'
import { formatCurrency, formatDate, propertyImage } from '../../utils/formatters'
import toast from 'react-hot-toast'

export default function BookingCheckout() {
  const { listingId } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const checkIn = params.get('checkIn')
  const checkOut = params.get('checkOut')
  const guests = parseInt(params.get('guests')||'1')
  const nights = Math.max(0, Math.round((new Date(checkOut)-new Date(checkIn))/(1000*60*60*24)))

  const { data: res } = useQuery({ queryKey:['listing',listingId], queryFn:()=>listingsApi.getById(listingId) })
  const listing = res?.data

  const subtotal = (listing?.pricePerNight||0)*nights
  const fee = subtotal*0.12
  const total = subtotal+fee

  const { mutate: book, isPending } = useMutation({
    mutationFn: () => reservationsApi.create({ listingId, checkInDate:checkIn, checkOutDate:checkOut, numGuests:guests }),
    onSuccess: (data) => { toast.success('Reservation requested!'); navigate(`/guest/reservations/${data.id}`) },
    onError: (err) => toast.error(err?.response?.data?.message || 'Booking failed. Please try again.'),
  })

  if (!listing) return <GuestHostLayout role="GUEST"><div className="max-w-3xl mx-auto px-4 py-8 text-center text-text-secondary">Loading…</div></GuestHostLayout>

  return (
    <GuestHostLayout role="GUEST">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={()=>navigate(-1)} className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6">
          <ChevronLeft size={16}/> Back
        </button>
        <h1 className="text-2xl font-bold mb-8">Confirm your reservation</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left */}
          <div className="lg:col-span-3 space-y-6">
            {/* Trip info */}
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-4">Your trip</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><Calendar size={18} className="text-brand-500"/>
                    <div><p className="text-xs text-text-secondary font-medium">Dates</p><p className="font-semibold">{formatDate(checkIn)} → {formatDate(checkOut)}</p></div>
                  </div>
                  <span className="text-sm text-text-secondary">{nights} nights</span>
                </div>
                <div className="flex items-center gap-3"><Users size={18} className="text-brand-500"/>
                  <div><p className="text-xs text-text-secondary font-medium">Guests</p><p className="font-semibold">{guests} guest{guests>1?'s':''}</p></div>
                </div>
                <div className="flex items-center gap-3"><MapPin size={18} className="text-brand-500"/>
                  <div><p className="text-xs text-text-secondary font-medium">Location</p><p className="font-semibold">{listing.location}</p></div>
                </div>
              </div>
            </div>

            {/* Cancellation */}
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-3">Cancellation policy</h2>
              <p className="text-sm text-text-secondary">This reservation requires host approval. You may cancel your confirmed reservation before check-in.</p>
            </div>

            {/* Payment (placeholder UI) */}
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-4">Payment info</h2>
              <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
                <CreditCard size={20} className="text-text-secondary"/>
                <span className="text-sm text-text-secondary">Payment is collected after host approval.</span>
              </div>
            </div>
          </div>

          {/* Right — summary */}
          <div className="lg:col-span-2">
            <div className="card p-6 sticky top-24">
              <div className="flex gap-4 pb-4 border-b border-border mb-4">
                <img src={propertyImage(listingId)} alt="" className="w-20 h-20 rounded-2xl object-cover shrink-0"/>
                <div className="min-w-0">
                  <p className="font-semibold text-sm leading-tight line-clamp-2">{listing.title}</p>
                  <p className="text-xs text-text-secondary mt-1 flex items-center gap-1"><MapPin size={11}/>{listing.location}</p>
                </div>
              </div>
              <h3 className="font-bold mb-4">Price details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-text-secondary">{formatCurrency(listing.pricePerNight)} × {nights} nights</span><span>{formatCurrency(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Service fee (12%)</span><span>{formatCurrency(fee)}</span></div>
                <div className="flex justify-between font-bold pt-3 border-t border-border text-base">
                  <span>Total</span><span>{formatCurrency(total)}</span>
                </div>
              </div>

              <button onClick={()=>book()} disabled={isPending||nights<=0}
                className="btn-primary w-full mt-6">
                {isPending ? 'Submitting…' : 'Request to book'}
              </button>
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-text-secondary">
                <Shield size={13}/> Protected by NextStay
              </div>
            </div>
          </div>
        </div>
      </div>
    </GuestHostLayout>
  )
}
