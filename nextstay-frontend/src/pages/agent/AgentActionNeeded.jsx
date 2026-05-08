import { useQuery } from '@tanstack/react-query'
import { ticketsApi } from '../../api/ticketsApi'
import EmployeeLayout from '../../components/layout/EmployeeLayout'
import { TicketBadge } from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { timeAgo } from '../../utils/formatters'

export default function AgentActionNeeded() {
  const navigate = useNavigate()
  const { data: tickets = [], isLoading } = useQuery({ queryKey: ['tickets', 'action-needed'], queryFn: () => ticketsApi.getActionNeeded() })

  return (
    <EmployeeLayout sidebarRole="SUPPORT_AGENT">
      <div className="max-w-4xl mx-auto">
        <div className="page-header"><h1 className="page-title">Action Needed Tickets</h1><p className="page-subtitle">Tickets flagged for refund or deactivation</p></div>
        {isLoading ? <p className="py-12 text-center text-text-secondary">Loading…</p>
          : tickets.length === 0 ? <EmptyState icon={AlertTriangle} title="No action-needed tickets" description="All clear! No tickets require escalation." />
            : (
              <div className="table-container">
                <table className="table">
                  <thead><tr><th>Ticket #</th><th>Subject</th><th>Action Type</th><th>Status</th><th>Updated</th></tr></thead>
                  <tbody>
                    {tickets.map(t => (
                      <tr key={t.id} className="cursor-pointer" onClick={() => navigate(`/agent/tickets/${t.id}`)}>
                        <td><span className="text-xs font-mono">{t.ticketNumber}</span></td>
                        <td><p className="font-medium text-sm truncate max-w-xs">{t.subject}</p></td>
                        <td><span className={`badge ${t.actionType === 'refund' ? 'badge-yellow' : 'badge-red'}`}>{t.actionType}</span></td>
                        <td><TicketBadge status={t.status} /></td>
                        <td><span className="text-xs text-text-secondary">{timeAgo(t.updatedAt)}</span></td>
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
