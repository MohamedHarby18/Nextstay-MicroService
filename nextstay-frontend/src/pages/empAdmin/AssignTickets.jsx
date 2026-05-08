import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketsApi } from '../../api/ticketsApi'
import { agentsApi } from '../../api/agentsApi'
import EmployeeLayout from '../../components/layout/EmployeeLayout'
import { TicketBadge, AgentRoleBadge } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import { ClipboardList, ChevronRight } from 'lucide-react'
import { timeAgo } from '../../utils/formatters'
import toast from 'react-hot-toast'

export default function AssignTickets() {
  const qc = useQueryClient()
  const [assignModal, setAssignModal] = useState(null)

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets', 'dashboard', 'open'],
    queryFn: () => ticketsApi.getDashboard('open'),
  })

  const { data: agents = [] } = useQuery({ queryKey: ['agents', 'active'], queryFn: agentsApi.getActive })

  const { mutate: assign, isPending } = useMutation({
    mutationFn: ({ ticketId, agentId }) => ticketsApi.assign(ticketId, agentId),
    onSuccess: () => { toast.success('Ticket assigned'); setAssignModal(null); qc.invalidateQueries(['tickets']) },
    onError: () => toast.error('Failed to assign ticket'),
  })

  // Get unassigned tickets
  const unassigned = tickets.filter(t => !t.assignedAgentId)

  return (
    <EmployeeLayout sidebarRole="ADMIN_EMPLOYEES">
      <div className="max-w-5xl mx-auto">
        <div className="page-header"><h1 className="page-title">Assign Tickets</h1><p className="page-subtitle">{unassigned.length} unassigned open tickets</p></div>

        {isLoading ? <p className="py-12 text-center text-text-secondary">Loading…</p>
          : unassigned.length === 0 ? <EmptyState icon={ClipboardList} title="All tickets assigned" description="No unassigned open tickets right now." />
            : (
              <div className="space-y-3">
                {unassigned.map(t => (
                  <div key={t.id} className="card-hover p-5 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-text-secondary">{t.ticketNumber}</span>
                        <TicketBadge status={t.status} />
                      </div>
                      <p className="font-semibold text-sm truncate">{t.subject}</p>
                      <p className="text-xs text-text-light mt-1">{timeAgo(t.createdAt)}</p>
                    </div>
                    <button onClick={() => setAssignModal(t)}
                      className="flex items-center gap-1 px-4 py-2 bg-empAdmin-500 text-white text-sm font-semibold rounded-xl hover:bg-empAdmin-600 transition-colors shrink-0">
                      Assign <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
      </div>

      {/* Assign modal */}
      <Modal open={!!assignModal} onClose={() => setAssignModal(null)} title="Assign to Agent" size="md">
        {assignModal && (
          <div className="space-y-4">
            <div className="card p-4 bg-muted">
              <p className="text-xs text-text-secondary">{assignModal.ticketNumber}</p>
              <p className="font-semibold text-sm">{assignModal.subject}</p>
            </div>
            <h3 className="font-bold text-sm">Select an agent</h3>
            {agents.length === 0 ? <p className="text-text-secondary text-sm">No active agents available.</p> : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {agents.map(a => (
                  <button key={a.id} onClick={() => assign({ ticketId: assignModal.id, agentId: a.id })}
                    disabled={isPending}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-empAdmin-accent hover:bg-amber-50 transition-all text-left">
                    <Avatar name={a.name} size={36} />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{a.name}</p>
                      <p className="text-xs text-text-secondary">{a.email}</p>
                    </div>
                    <AgentRoleBadge role={a.role} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </EmployeeLayout>
  )
}
