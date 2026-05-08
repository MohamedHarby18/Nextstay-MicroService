import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, ChevronRight } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reservationsApi } from '../../api/reservationsApi'
import GuestHostLayout from '../../components/layout/GuestHostLayout'
import { ReservationBadge } from '../../components/ui/Badge'
import { SkeletonCard } from '../../components/ui/SkeletonLoader'
import EmptyState from '../../components/ui/EmptyState'
import Tabs from '../../components/ui/Tabs'
import { formatDate, propertyImage } from '../../utils/formatters'
import toast from 'react-hot-toast'

const STATUSES = ['All','PENDING','CONFIRMED','COMPLETED','CANCELLED','REJECTED']

export default function MyReservations() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [tab, setTab] = useState('All')

  const { data=[], isLoading } = useQuery({ queryKey:['reservations','my'], queryFn:reservationsApi.getMy })

  const { mutate: cancel } = useMutation({
    mutationFn: (id) => reservationsApi.cancel(id),
    onSuccess: () => { toast.success('Reservation cancelled'); qc.invalidateQueries(['reservations','my']) },
    onError: (e) => toast.error(e?.response?.data?.message||'Cancellation failed'),
  })

  const filtered = tab==='All' ? data : data.filter(r=>r.status===tab)

  const tabs = STATUSES.map(s=>({ id:s, label:s==='All'?'All stays':s.charAt(0)+s.slice(1).toLowerCase(), count:s==='All'?data.length:data.filter(r=>r.status===s).length }))

  return (
    <GuestHostLayout role="GUEST">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="page-header">
          <h1 className="page-title">My Reservations</h1>
          <p className="page-subtitle">Track all your upcoming and past stays</p>
        </div>

        <div className="overflow-x-auto mb-6">
          <Tabs tabs={tabs} defaultTab="All" onChange={setTab}/>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{Array.from({length:4}).map((_,i)=><SkeletonCard key={i}/>)}</div>
        ) : filtered.length===0 ? (
          <EmptyState icon={Calendar} title="No reservations found" description="When you book a stay, it will appear here." action={<button onClick={()=>navigate('/guest')} className="btn-primary btn-sm">Explore listings</button>}/>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map(r => (
              <div key={r.id} className="card-hover overflow-hidden cursor-pointer" onClick={()=>navigate(`/guest/reservations/${r.id}`)}>
                <div className="flex gap-4 p-4">
                  <img src={propertyImage(r.listingId)} alt="" className="w-24 h-24 rounded-2xl object-cover shrink-0"/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <ReservationBadge status={r.status}/>
                      <ChevronRight size={16} className="text-text-light shrink-0"/>
                    </div>
                    <p className="text-sm font-semibold text-text-primary truncate mb-1">{r.listingId}</p>
                    <p className="text-xs text-text-secondary flex items-center gap-1 mb-1">
                      <Calendar size={11}/> {formatDate(r.checkInDate)} → {formatDate(r.checkOutDate)}
                    </p>
                    <p className="text-xs text-text-secondary">{r.numGuests} guest{r.numGuests>1?'s':''}</p>
                  </div>
                </div>
                {r.status==='CONFIRMED' && (
                  <div className="px-4 pb-4">
                    <button onClick={(e)=>{e.stopPropagation();cancel(r.id)}}
                      className="text-xs text-red-500 font-semibold hover:underline">Cancel reservation</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </GuestHostLayout>
  )
}
