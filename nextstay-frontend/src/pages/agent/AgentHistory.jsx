import { useQuery } from '@tanstack/react-query'
import { ticketsApi } from '../../api/ticketsApi'
import EmployeeLayout from '../../components/layout/EmployeeLayout'
import { TicketBadge } from '../../components/ui/Badge'
import { useNavigate } from 'react-router-dom'
import { timeAgo } from '../../utils/formatters'
import { CheckCircle } from 'lucide-react'
import EmptyState from '../../components/ui/EmptyState'

export default function AgentHistory() {
  const navigate = useNavigate()
  const { data: resolved = [] } = useQuery({ queryKey: ['tickets', 'dashboard', 'resolved'], queryFn: () => ticketsApi.getDashboard('resolved') })
  const { data: closed = [] } = useQuery({ queryKey: ['tickets', 'dashboard', 'closed'], queryFn: () => ticketsApi.getDashboard('closed') })

  const all = [...resolved, ...closed].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

  return (
    <EmployeeLayout sidebarRole="SUPPORT_AGENT">
      <div className="max-w-4xl mx-auto">
        <div className="page-header"><h1 className="page-title">Resolution History</h1><p className="page-subtitle">{all.length} resolved/closed tickets</p></div>
        {all.length === 0 ? <EmptyState icon={CheckCircle} title="No resolved tickets yet" />
          : (
            <div className="table-container">
              <table className="table">
                <thead><tr><th>Ticket #</th><th>Subject</th><th>Status</th><th>Resolved</th></tr></thead>
                <tbody>
                  {all.map(t => (
                    <tr key={t.id} className="cursor-pointer" onClick={() => navigate(`/agent/tickets/${t.id}`)}>
                      <td><span className="text-xs font-mono">{t.ticketNumber}</span></td>
                      <td><p className="font-medium text-sm truncate max-w-xs">{t.subject}</p></td>
                      <td><TicketBadge status={t.status} /></td>
                      <td><span className="text-xs text-text-secondary">{timeAgo(t.resolvedAt || t.closedAt || t.updatedAt)}</span></td>
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
