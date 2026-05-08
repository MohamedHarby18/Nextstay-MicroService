import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Send } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketsApi } from '../../api/ticketsApi'
import { useAuthStore } from '../../store/authStore'
import GuestHostLayout from '../../components/layout/GuestHostLayout'
import { TicketBadge } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import { formatDateTime } from '../../utils/formatters'

export default function TicketConversation() {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const { userId, role, user } = useAuthStore()
  const qc = useQueryClient()
  const [msg, setMsg] = useState('')
  const bottomRef = useRef()

  const { data:tickets=[] } = useQuery({ queryKey:['tickets','my'], queryFn:ticketsApi.getMy })
  const ticket = tickets.find(t=>t.id===ticketId)

  const { data:messages=[], isLoading } = useQuery({
    queryKey:['ticket','messages',ticketId],
    queryFn:()=>ticketsApi.getMessages(ticketId),
    refetchInterval:10000,
  })

  const { mutate: send, isPending } = useMutation({
    mutationFn:()=>ticketsApi.reply(ticketId, msg),
    onSuccess:()=>{ setMsg(''); qc.invalidateQueries(['ticket','messages',ticketId]) },
  })

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}) },[messages])

  const isMine = (m) => m.senderId===userId

  return (
    <GuestHostLayout role={role}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col" style={{height:'calc(100vh - 80px)'}}>
        {/* Header */}
        <div className="mb-4 shrink-0">
          <button onClick={()=>navigate(-1)} className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-3">
            <ChevronLeft size={16}/> Tickets
          </button>
          {ticket && (
            <div className="card p-4 flex items-start justify-between gap-4">
              <div>
                <h1 className="font-bold text-text-primary">{ticket.subject}</h1>
                <p className="text-xs text-text-secondary mt-1">{ticket.ticketNumber}</p>
              </div>
              <TicketBadge status={ticket.status}/>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4 min-h-0">
          {isLoading ? <p className="text-center text-text-secondary text-sm">Loading messages…</p>
          : messages.length===0 ? <p className="text-center text-text-secondary text-sm">No messages yet. Start the conversation!</p>
          : messages.map(m=>(
            <div key={m.id} className={`flex items-end gap-3 ${isMine(m)?'flex-row-reverse':''}`}>
              <Avatar name={m.senderRole==='support_agent'?'Agent':user?.name||'User'} size={32}/>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm ${isMine(m)?'bg-brand-500 text-white rounded-br-sm':'bg-gray-100 text-text-primary rounded-bl-sm'}`}>
                <p>{m.messageText}</p>
                <p className={`text-xs mt-1 ${isMine(m)?'text-white/70':'text-text-light'}`}>{formatDateTime(m.sentAt)}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef}/>
        </div>

        {/* Input */}
        <div className="shrink-0 pt-4 border-t border-border">
          {ticket?.status==='closed' ? (
            <p className="text-center text-sm text-text-secondary py-3">This ticket is closed.</p>
          ) : (
            <div className="flex items-end gap-3">
              <textarea rows={2} value={msg} onChange={e=>setMsg(e.target.value)}
                onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();if(msg.trim())send()} }}
                placeholder="Type a message… (Enter to send)"
                className="input flex-1 resize-none text-sm py-3"/>
              <button onClick={()=>send()} disabled={!msg.trim()||isPending}
                className="p-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-50">
                <Send size={18}/>
              </button>
            </div>
          )}
        </div>
      </div>
    </GuestHostLayout>
  )
}
