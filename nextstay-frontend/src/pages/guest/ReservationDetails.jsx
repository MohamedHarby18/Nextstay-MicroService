import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Calendar, Users, MapPin, Clock, MessageSquare } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { reservationsApi } from '../../api/reservationsApi'
import GuestHostLayout from '../../components/layout/GuestHostLayout'
import { ReservationBadge } from '../../components/ui/Badge'
import { formatDate, formatDateTime, formatCurrency, propertyImage } from '../../utils/formatters'

export default function ReservationDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: r, isLoading } = useQuery({ queryKey:['reservation',id], queryFn:()=>reservationsApi.getById(id) })

  if (isLoading) return <GuestHostLayout role="GUEST"><div className="p-8 text-center text-text-secondary">Loading…</div></GuestHostLayout>
  if (!r) return <GuestHostLayout role="GUEST"><div className="p-8 text-center text-text-secondary">Reservation not found</div></GuestHostLayout>

  const nights = Math.round((new Date(r.checkOutDate)-new Date(r.checkInDate))/(1000*60*60*24))

  return (
    <GuestHostLayout role="GUEST">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={()=>navigate('/guest/reservations')} className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6">
          <ChevronLeft size={16}/> My Reservations
        </button>

        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Reservation details</h1>
            <p className="text-text-secondary text-sm mt-1">Booked {formatDateTime(r.createdAt)}</p>
          </div>
          <ReservationBadge status={r.status}/>
        </div>

        <div className="space-y-4">
          {/* Property */}
          <div className="card overflow-hidden">
            <img src={propertyImage(r.listingId)} alt="" className="w-full h-40 object-cover"/>
            <div className="p-4">
              <p className="font-bold text-text-primary">{r.listingId}</p>
              <button onClick={()=>navigate(`/guest/property/${r.listingId}`)} className="text-sm text-brand-500 font-semibold hover:underline mt-1">View listing</button>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-5">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2 flex items-center gap-2"><Calendar size={14}/> Check-in</p>
              <p className="font-bold">{formatDate(r.checkInDate)}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2 flex items-center gap-2"><Calendar size={14}/> Check-out</p>
              <p className="font-bold">{formatDate(r.checkOutDate)}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2 flex items-center gap-2"><Users size={14}/> Guests</p>
              <p className="font-bold">{r.numGuests} guest{r.numGuests>1?'s':''}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2 flex items-center gap-2"><Clock size={14}/> Duration</p>
              <p className="font-bold">{nights} night{nights!==1?'s':''}</p>
            </div>
          </div>

          {/* Actions based on status */}
          <div className="card p-5">
            <h3 className="font-bold mb-3">Actions</h3>
            {r.status==='COMPLETED' && (
              <button onClick={()=>navigate(`/guest/review/${r.id}`)} className="btn-primary btn-sm">
                Leave a review
              </button>
            )}
            {r.status==='PENDING' && <p className="text-sm text-text-secondary">Waiting for host approval.</p>}
            {r.status==='CONFIRMED' && <p className="text-sm text-emerald-600 font-medium">✓ Booking confirmed! See you there.</p>}
            {r.status==='CANCELLED' && <p className="text-sm text-text-secondary">This reservation has been cancelled.</p>}
            {r.status==='REJECTED' && <p className="text-sm text-red-500">This reservation was declined by the host.</p>}
            <button onClick={()=>navigate('/guest/tickets')} className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mt-3 transition-colors">
              <MessageSquare size={14}/> Contact support
            </button>
          </div>
        </div>
      </div>
    </GuestHostLayout>
  )
}
