import { useQuery } from '@tanstack/react-query'
import { ticketsApi } from '../../api/ticketsApi'
import { useAuthStore } from '../../store/authStore'
import EmployeeLayout from '../../components/layout/EmployeeLayout'
import KpiCard from '../../components/ui/KpiCard'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CheckCircle, Clock, BarChart3, TrendingUp } from 'lucide-react'

export default function AgentPerformance() {
  const { userId } = useAuthStore()

  const { data: stats = {} } = useQuery({ queryKey: ['agent', 'stats', userId], queryFn: () => ticketsApi.getAgentStats(userId), enabled: !!userId })
  const { data: overall = {} } = useQuery({ queryKey: ['tickets', 'stats', 'overall'], queryFn: ticketsApi.getOverallStats })

  const chartData = Object.entries(stats).map(([key, value]) => ({ name: key.replace('_', ' '), count: value }))

  return (
    <EmployeeLayout sidebarRole="SUPPORT_AGENT">
      <div className="max-w-4xl mx-auto">
        <div className="page-header"><h1 className="page-title">My Performance</h1><p className="page-subtitle">Your ticket resolution metrics</p></div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard title="Open" value={stats.open || 0} icon={Clock} accentColor="#3B82F6" />
          <KpiCard title="In Progress" value={stats.in_progress || 0} icon={BarChart3} accentColor="#F59E0B" />
          <KpiCard title="Resolved" value={stats.resolved || 0} icon={CheckCircle} accentColor="#10B981" />
          <KpiCard title="Closed" value={stats.closed || 0} icon={TrendingUp} accentColor="#6B7280" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="font-bold mb-4">My Stats Breakdown</h2>
            {chartData.length === 0 ? <p className="text-text-secondary text-sm py-8 text-center">No data</p> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12 }} />
                  <Bar dataKey="count" fill="#52B788" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="card p-6">
            <h2 className="font-bold mb-4">Platform Overall Stats</h2>
            <div className="space-y-3">
              {Object.entries(overall).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <span className="text-sm text-text-secondary capitalize">{key.replace('_', ' ')}</span>
                  <span className="font-bold text-lg">{val}</span>
                </div>
              ))}
              {Object.keys(overall).length === 0 && <p className="text-text-secondary text-sm text-center py-4">No data</p>}
            </div>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  )
}
