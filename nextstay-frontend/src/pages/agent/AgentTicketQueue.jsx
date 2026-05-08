import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Filter } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketsApi } from '../../api/ticketsApi'
import EmployeeLayout from '../../components/layout/EmployeeLayout'
import { TicketBadge } from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import SearchBar from '../../components/ui/SearchBar'
import { timeAgo } from '../../utils/formatters'

const FILTERS = [
  { id: null, label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'resolved', label: 'Resolved' },
  { id: 'closed', label: 'Closed' },
]

export default function AgentTicketQueue() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState(null)
  const [search, setSearch] = useState('')

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets', 'dashboard', statusFilter],
    queryFn: () => ticketsApi.getDashboard(statusFilter),
  })

  const filtered = tickets.filter(t =>
    !search || t.subject?.toLowerCase().includes(search.toLowerCase()) || t.ticketNumber?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <EmployeeLayout sidebarRole="SUPPORT_AGENT">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="page-title">Ticket Queue</h1><p className="page-subtitle">{filtered.length} tickets</p></div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <SearchBar placeholder="Search tickets…" onSearch={setSearch} className="w-64" />
          <div className="flex gap-1 p-1 bg-muted rounded-xl">
            {FILTERS.map(f => (
              <button key={f.label} onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === f.id ? 'bg-white shadow-sm text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? <p className="text-center py-12 text-text-secondary">Loading…</p>
          : filtered.length === 0 ? <EmptyState title="No tickets found" description="Adjust your filters or check back later." />
            : (
              <div className="table-container">
                <table className="table">
                  <thead><tr><th>Ticket #</th><th>Subject</th><th>Status</th><th>User Role</th><th>Action Needed</th><th>Updated</th><th></th></tr></thead>
                  <tbody>
                    {filtered.map(t => (
                      <tr key={t.id} className="cursor-pointer" onClick={() => navigate(`/agent/tickets/${t.id}`)}>
                        <td><span className="text-xs font-mono text-text-secondary">{t.ticketNumber}</span></td>
                        <td><p className="font-medium text-sm truncate max-w-xs">{t.subject}</p></td>
                        <td><TicketBadge status={t.status} /></td>
                        <td><span className="badge badge-blue">{t.userRole}</span></td>
                        <td>{t.actionNeeded ? <span className="badge badge-red">{t.actionType || 'Yes'}</span> : <span className="text-text-light text-xs">—</span>}</td>
                        <td><span className="text-xs text-text-secondary">{timeAgo(t.updatedAt)}</span></td>
                        <td><ChevronRight size={14} className="text-text-light" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
      </div>
    </EmployeeLayout>
  )
}
