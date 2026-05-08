import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Send, AlertTriangle } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketsApi } from '../../api/ticketsApi'
import { useAuthStore } from '../../store/authStore'
import EmployeeLayout from '../../components/layout/EmployeeLayout'
import { TicketBadge } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import { formatDateTime } from '../../utils/formatters'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['open', 'in_progress', 'resolved', 'closed']

export default function AgentTicketWorkspace() {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const { userId, role } = useAuthStore()
  const qc = useQueryClient()
  const [msg, setMsg] = useState('')
  const bottomRef = useRef()

  const { data: tickets = [] } = useQuery({ queryKey: ['tickets', 'dashboard', null], queryFn: () => ticketsApi.getDashboard(null) })
  const ticket = tickets.find(t => t.id === ticketId)

  const { data: messages = [] } = useQuery({
    queryKey: ['ticket', 'messages', ticketId],
    queryFn: () => ticketsApi.getMessages(ticketId),
    refetchInterval: 8000,
  })

  const { mutate: send, isPending: sending } = useMutation({
    mutationFn: () => ticketsApi.reply(ticketId, msg),
    onSuccess: () => { setMsg(''); qc.invalidateQueries(['ticket', 'messages', ticketId]) },
  })

  const { mutate: updateStatus } = useMutation({
    mutationFn: (status) => ticketsApi.updateStatus(ticketId, status),
    onSuccess: () => { toast.success('Status updated'); qc.invalidateQueries(['tickets']) },
    onError: () => toast.error('Failed to update status'),
  })

  const { mutate: flagAction } = useMutation({
    mutationFn: (actionType) => ticketsApi.flagAction(ticketId, actionType),
    onSuccess: () => { toast.success('Flagged for action'); qc.invalidateQueries(['tickets']) },
    onError: () => toast.error('Failed'),
  })

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  return (
    <EmployeeLayout sidebarRole="SUPPORT_AGENT">
      <div className="flex h-full gap-6">
        {/* Left — ticket info */}
        <div className="w-80 shrink-0 space-y-4 overflow-y-auto">
          <button onClick={() => navigate('/agent/tickets')} className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary">
            <ChevronLeft size={16} /> Back to queue
          </button>

          {ticket && (
            <div className="card p-5 space-y-4">
              <div>
                <p className="text-xs text-text-light font-mono">{ticket.ticketNumber}</p>
                <h2 className="font-bold text-text-primary mt-1">{ticket.subject}</h2>
              </div>
              <div className="flex items-center gap-2">
                <TicketBadge status={ticket.status} />
                {ticket.actionNeeded && <span className="badge badge-red">{ticket.actionType}</span>}
              </div>
              <div className="text-xs text-text-secondary space-y-1">
                <p><span className="font-semibold">User role:</span> {ticket.userRole}</p>
                <p><span className="font-semibold">Created:</span> {formatDateTime(ticket.createdAt)}</p>
                {ticket.assignedAgentId && <p><span className="font-semibold">Assigned to:</span> {ticket.assignedAgentId}</p>}
              </div>
              <p className="text-sm text-text-secondary border-t border-border pt-3">{ticket.description}</p>
            </div>
          )}

          {/* Actions panel */}
          <div className="card p-5 space-y-3">
            <h3 className="font-bold text-sm">Quick Actions</h3>
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1 block">Update Status</label>
              <select className="input text-sm py-2" value={ticket?.status || ''} onChange={(e) => updateStatus(e.target.value)}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => flagAction('refund')} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-amber-300 bg-amber-50 text-amber-700 text-xs font-semibold rounded-xl hover:bg-amber-100 transition-colors">
                <AlertTriangle size={13} /> Flag Refund
              </button>
              <button onClick={() => flagAction('deactivation')} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-red-300 bg-red-50 text-red-700 text-xs font-semibold rounded-xl hover:bg-red-100 transition-colors">
                <AlertTriangle size={13} /> Flag Deactivation
              </button>
            </div>
          </div>
        </div>

        {/* Right — conversation */}
        <div className="flex-1 flex flex-col min-w-0 card overflow-hidden">
          <div className="px-6 py-4 border-b border-border shrink-0">
            <h3 className="font-bold text-text-primary">Conversation</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? <p className="text-sm text-text-secondary text-center py-8">No messages yet.</p>
              : messages.map(m => (
                <div key={m.id} className={`flex items-end gap-3 ${m.senderId === userId ? 'flex-row-reverse' : ''}`}>
                  <Avatar name={m.senderRole === 'support_agent' ? 'Agent' : m.senderRole} size={32} />
                  <div className={`max-w-sm px-4 py-3 rounded-2xl text-sm ${m.senderId === userId ? 'bg-agent-500 text-white rounded-br-sm' : 'bg-gray-100 text-text-primary rounded-bl-sm'}`}>
                    <p className={`text-xs font-semibold mb-1 ${m.senderId === userId ? 'text-white/70' : 'text-text-secondary'}`}>{m.senderRole}</p>
                    <p>{m.messageText}</p>
                    <p className={`text-xs mt-1 ${m.senderId === userId ? 'text-white/50' : 'text-text-light'}`}>{formatDateTime(m.sentAt)}</p>
                  </div>
                </div>
              ))}
            <div ref={bottomRef} />
          </div>
          <div className="px-6 py-4 border-t border-border shrink-0">
            {ticket?.status === 'closed' ? <p className="text-center text-sm text-text-secondary">Ticket closed.</p> : (
              <div className="flex gap-3">
                <input value={msg} onChange={e => setMsg(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && msg.trim()) send() }}
                  placeholder="Type a reply…" className="input flex-1 text-sm" />
                <button onClick={() => send()} disabled={!msg.trim() || sending}
                  className="p-3 bg-agent-500 text-white rounded-xl hover:bg-agent-600 transition-colors disabled:opacity-50">
                  <Send size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </EmployeeLayout>
  )
}
