import { useNavigate } from 'react-router-dom'
import { Home, Calendar, Star, DollarSign, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { listingsApi } from '../../api/listingsApi'
import { reservationsApi } from '../../api/reservationsApi'
import { reviewsApi } from '../../api/reviewsApi'
import { useAuthStore } from '../../store/authStore'
import GuestHostLayout from '../../components/layout/GuestHostLayout'
import KpiCard from '../../components/ui/KpiCard'
import { ReservationBadge, ListingBadge } from '../../components/ui/Badge'
import { SkeletonKpi } from '../../components/ui/SkeletonLoader'
import { formatCurrency, formatDate, propertyImage } from '../../utils/formatters'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function HostDashboard() {
  const { userId } = useAuthStore()
  const navigate = useNavigate()

  const { data: listingsRes, isLoading: lLoad } = useQuery({ queryKey:['listings','host',userId], queryFn:()=>listingsApi.getByHost(userId), enabled:!!userId })
  const { data: reservations=[], isLoading: rLoad } = useQuery({ queryKey:['reservations','my'], queryFn:reservationsApi.getMy })

  const listings = listingsRes?.data || []
  const pending = reservations.filter(r=>r.status==='PENDING')
  const confirmed = reservations.filter(r=>r.status==='CONFIRMED')
  const completed = reservations.filter(r=>r.status==='COMPLETED')
  const totalEarnings = completed.length * 200 // approximate

  const avgRating = listings.length ? (listings.reduce((s,l)=>s+(l.averageRating||0),0)/listings.length).toFixed(1) : '—'

  const chartData = ['Jan','Feb','Mar','Apr','May','Jun'].map((m,i)=>({ month:m, bookings: Math.floor(Math.random()*10+2), earnings: Math.floor(Math.random()*2000+500) }))

  return (
    <GuestHostLayout role="HOST">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="page-header">
          <h1 className="page-title">Host Dashboard</h1>
          <p className="page-subtitle">Your property performance at a glance</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {lLoad ? Array.from({length:4}).map((_,i)=><SkeletonKpi key={i}/>) : <>
            <KpiCard title="Active Listings" value={listings.filter(l=>l.status==='ACTIVE').length} icon={Home} accentColor="#2E86AB" trend="up"/>
            <KpiCard title="Pending Requests" value={pending.length} icon={Clock} accentColor="#F39C12" trend={pending.length>0?'up':'up'}/>
            <KpiCard title="Confirmed Stays" value={confirmed.length} icon={CheckCircle} accentColor="#52B788" trend="up"/>
            <KpiCard title="Avg. Rating" value={avgRating} icon={Star} accentColor="#FF5A5F"/>
          </>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart */}
          <div className="lg:col-span-2 card p-6">
            <h2 className="font-bold text-text-primary mb-4">Booking Trends (6 months)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                <XAxis dataKey="month" tick={{fontSize:12,fill:'#717171'}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:12,fill:'#717171'}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{borderRadius:12,border:'1px solid #e8e8e8',boxShadow:'0 4px 24px rgba(0,0,0,0.08)'}}/>
                <Bar dataKey="bookings" fill="#2E86AB" radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* My listings quick view */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-text-primary">My Listings</h2>
              <button onClick={()=>navigate('/host/listings')} className="text-sm text-host-accent font-semibold hover:underline">View all</button>
            </div>
            {listings.slice(0,3).map((l,i)=>(
              <div key={l.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                <img src={propertyImage(l.id||i,200,200)} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0"/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{l.title}</p>
                  <ListingBadge status={l.status}/>
                </div>
              </div>
            ))}
            <button onClick={()=>navigate('/host/listings/create')} className="btn-primary w-full btn-sm mt-4">+ Add listing</button>
          </div>
        </div>

        {/* Pending requests */}
        {pending.length > 0 && (
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-text-primary">Pending Booking Requests</h2>
              <button onClick={()=>navigate('/host/bookings')} className="text-sm text-host-accent font-semibold hover:underline">View all</button>
            </div>
            <div className="table-container">
              <table className="table">
                <thead><tr><th>Listing</th><th>Check-in</th><th>Check-out</th><th>Guests</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {pending.slice(0,5).map(r=>(
                    <tr key={r.id}>
                      <td><p className="text-sm font-medium truncate max-w-xs">{r.listingId}</p></td>
                      <td>{formatDate(r.checkInDate)}</td>
                      <td>{formatDate(r.checkOutDate)}</td>
                      <td>{r.numGuests}</td>
                      <td><ReservationBadge status={r.status}/></td>
                      <td>
                        <button onClick={()=>navigate('/host/bookings')} className="text-host-accent text-sm font-semibold hover:underline">Review →</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </GuestHostLayout>
  )
}
