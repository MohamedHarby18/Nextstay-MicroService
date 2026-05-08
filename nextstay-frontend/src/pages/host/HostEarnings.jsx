import { DollarSign, TrendingUp, Calendar } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { reservationsApi } from '../../api/reservationsApi'
import { listingsApi } from '../../api/listingsApi'
import { useAuthStore } from '../../store/authStore'
import GuestHostLayout from '../../components/layout/GuestHostLayout'
import KpiCard from '../../components/ui/KpiCard'
import { formatCurrency } from '../../utils/formatters'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#2E86AB', '#52B788', '#FF5A5F', '#F39C12', '#9B59B6']

export default function HostEarnings() {
  const { userId } = useAuthStore()

  const { data: reservations = [] } = useQuery({ queryKey: ['reservations', 'my'], queryFn: reservationsApi.getMy })
  const { data: listingsRes } = useQuery({ queryKey: ['listings', 'host', userId], queryFn: () => listingsApi.getByHost(userId), enabled: !!userId })
  const listings = listingsRes?.data || []

  const completed = reservations.filter(r => r.status === 'COMPLETED' || r.status === 'CONFIRMED')
  const totalNights = completed.reduce((sum, r) => {
    const nights = Math.round((new Date(r.checkOutDate) - new Date(r.checkInDate)) / (1000 * 60 * 60 * 24))
    return sum + Math.max(0, nights)
  }, 0)

  // Simulated monthly data
  const monthlyData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => ({
    month: m,
    earnings: Math.floor(Math.random() * 3000 + 500),
  }))

  const statusData = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED'].map(s => ({
    name: s.charAt(0) + s.slice(1).toLowerCase(),
    value: reservations.filter(r => r.status === s).length,
  })).filter(d => d.value > 0)

  return (
    <GuestHostLayout role="HOST">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="page-header">
          <h1 className="page-title">Earnings & Statistics</h1>
          <p className="page-subtitle">Your hosting performance overview</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard title="Total Bookings" value={completed.length} icon={Calendar} accentColor="#2E86AB" trend="up" />
          <KpiCard title="Total Nights Hosted" value={totalNights} icon={TrendingUp} accentColor="#52B788" trend="up" />
          <KpiCard title="Active Listings" value={listings.filter(l => l.status === 'ACTIVE').length} icon={DollarSign} accentColor="#FF5A5F" />
          <KpiCard title="Avg. Rating" value={listings.length ? (listings.reduce((s, l) => s + (l.averageRating || 0), 0) / listings.length).toFixed(1) : '—'} icon={TrendingUp} accentColor="#F39C12" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="font-bold mb-4">Monthly Earnings</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#717171' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#717171' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e8e8e8' }} />
                <Bar dataKey="earnings" fill="#2E86AB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6">
            <h2 className="font-bold mb-4">Reservation Status</h2>
            {statusData.length === 0 ? <p className="text-text-secondary text-sm py-8 text-center">No data yet</p> : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </GuestHostLayout>
  )
}
