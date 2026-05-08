import { useQuery } from '@tanstack/react-query'
import { ticketsApi } from '../../api/ticketsApi'
import EmployeeLayout from '../../components/layout/EmployeeLayout'
import { TicketBadge } from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { CreditCard, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { timeAgo } from '../../utils/formatters'

export default function AdminRefunds() {
  const navigate = useNavigate()
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets', 'action-needed', 'refund'],
    queryFn: () => ticketsApi.getActionNeeded('refund'),
  })

  return (
    <EmployeeLayout sidebarRole="ADMIN_USERS">
      <div className="max-w-4xl mx-auto">
        <div className="page-header"><h1 className="page-title">Refund Requests</h1><p className="page-subtitle">Tickets flagged for refund processing</p></div>

        {isLoading ? <p className="py-12 text-center text-text-secondary">Loading…</p>
          : tickets.length === 0 ? <EmptyState icon={CreditCard} title="No refund requests" description="Tickets flagged for refund will appear here." />
            : (
              <div className="space-y-3">
                {tickets.map(t => (
                  <div key={t.id} className="card-hover p-5 flex items-center justify-between cursor-pointer"
                    onClick={() => navigate(`/agent/tickets/${t.id}`)}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-text-secondary">{t.ticketNumber}</span>
                        <TicketBadge status={t.status} />
                        <span className="badge badge-yellow">Refund</span>
                      </div>
                      <p className="font-semibold text-sm truncate">{t.subject}</p>
                      <p className="text-xs text-text-light mt-1">{timeAgo(t.updatedAt)}</p>
                    </div>
                    <ChevronRight size={16} className="text-text-light shrink-0" />
                  </div>
                ))}
              </div>
            )}
      </div>
    </EmployeeLayout>
  )
}
