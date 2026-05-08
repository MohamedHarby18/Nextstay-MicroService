import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reservationsApi } from '../../api/reservationsApi'
import GuestHostLayout from '../../components/layout/GuestHostLayout'
import { ReservationBadge } from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import Tabs from '../../components/ui/Tabs'
import { formatDate, propertyImage } from '../../utils/formatters'
import toast from 'react-hot-toast'
import { useState } from 'react'

const STATUSES = ['All','PENDING','CONFIRMED','COMPLETED','CANCELLED','REJECTED']

export default function HostBookings() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [tab, setTab] = useState('All')

  const { data: all = [], isLoading } = useQuery({ queryKey: ['reservations', 'my'], queryFn: reservationsApi.getMy })

  const { mutate: approve } = useMutation({
    mutationFn: (id) => reservationsApi.approve(id),
    onSuccess: () => { toast.success('Booking approved'); qc.invalidateQueries(['reservations', 'my']) },
    onError: (e) => toast.error(e?.response?.data?.message || 'Failed'),
  })
  const { mutate: decline } = useMutation({
    mutationFn: (id) => reservationsApi.decline(id),
    onSuccess: () => { toast.success('Booking declined'); qc.invalidateQueries(['reservations', 'my']) },
    onError: (e) => toast.error(e?.response?.data?.message || 'Failed'),
  })

  const filtered = tab === 'All' ? all : all.filter(r => r.status === tab)
  const tabs = STATUSES.map(s => ({ id: s, label: s === 'All' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase(), count: s === 'All' ? all.length : all.filter(r => r.status === s).length }))

  return (
    <GuestHostLayout role="HOST">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="page-header">
          <h1 className="page-title">Booking Requests</h1>
          <p className="page-subtitle">Manage reservations for your properties</p>
        </div>

        <div className="overflow-x-auto mb-6"><Tabs tabs={tabs} defaultTab="All" onChange={setTab} /></div>

        {isLoading ? <p className="text-center py-12 text-text-secondary">Loading…</p>
          : filtered.length === 0 ? <EmptyState icon={Clock} title="No bookings found" description="Bookings from guests will appear here." />
            : (
              <div className="table-container">
                <table className="table">
                  <thead><tr><th>Property</th><th>Check-in</th><th>Check-out</th><th>Guests</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filtered.map(r => (
                      <tr key={r.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <img src={propertyImage(r.listingId, 100, 100)} alt="" className="w-10 h-10 rounded-xl object-cover" />
                            <span className="text-sm font-medium truncate max-w-[160px]">{r.listingId}</span>
                          </div>
                        </td>
                        <td>{formatDate(r.checkInDate)}</td>
                        <td>{formatDate(r.checkOutDate)}</td>
                        <td>{r.numGuests}</td>
                        <td><ReservationBadge status={r.status} /></td>
                        <td>
                          {r.status === 'PENDING' ? (
                            <div className="flex gap-2">
                              <button onClick={() => approve(r.id)} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition-colors">
                                <CheckCircle size={13} /> Accept
                              </button>
                              <button onClick={() => decline(r.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors">
                                <XCircle size={13} /> Decline
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => navigate(`/guest/reservations/${r.id}`)} className="text-host-accent text-sm font-semibold hover:underline flex items-center gap-1">
                              Details <ChevronRight size={13} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
      </div>
    </GuestHostLayout>
  )
}
