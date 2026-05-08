import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, Plus, ChevronRight } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketsApi } from '../../api/ticketsApi'
import { useAuthStore } from '../../store/authStore'
import GuestHostLayout from '../../components/layout/GuestHostLayout'
import { TicketBadge } from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import { timeAgo } from '../../utils/formatters'
import toast from 'react-hot-toast'

export default function GuestTickets() {
  const navigate = useNavigate()
  const { userId, role } = useAuthStore()
  const qc = useQueryClient()
  const [newModal, setNewModal] = useState(false)
  const [form, setForm] = useState({ subject:'', description:'' })

  const { data:tickets=[], isLoading } = useQuery({ queryKey:['tickets','my'], queryFn:ticketsApi.getMy })

  const { mutate: create, isPending } = useMutation({
    mutationFn:()=>ticketsApi.create({ subject:form.subject, description:form.description }),
    onSuccess:()=>{ toast.success('Ticket created!'); setNewModal(false); setForm({subject:'',description:''}); qc.invalidateQueries(['tickets','my']) },
    onError:(e)=>toast.error(e?.response?.data?.message||'Failed to create ticket'),
  })

  return (
    <GuestHostLayout role={role}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="page-title">Support Tickets</h1><p className="page-subtitle">Get help with your bookings</p></div>
          <button onClick={()=>setNewModal(true)} className="btn-primary btn-sm"><Plus size={16}/>New ticket</button>
        </div>

        {isLoading ? <div className="text-center py-8 text-text-secondary">Loading…</div>
        : tickets.length===0 ? (
          <EmptyState icon={MessageSquare} title="No tickets yet" description="Need help? Open a support ticket and our team will assist you."
            action={<button onClick={()=>setNewModal(true)} className="btn-primary btn-sm">Open a ticket</button>}/>
        ) : (
          <div className="space-y-3">
            {tickets.map(t=>(
              <div key={t.id} className="card-hover p-5 cursor-pointer flex items-start justify-between gap-4" onClick={()=>navigate(`/guest/tickets/${t.id}`)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <TicketBadge status={t.status}/>
                    {t.actionNeeded && <span className="badge badge-red">Action needed</span>}
                    <span className="text-xs text-text-light">{t.ticketNumber}</span>
                  </div>
                  <p className="font-semibold text-text-primary truncate">{t.subject}</p>
                  <p className="text-xs text-text-secondary mt-1 line-clamp-1">{t.description}</p>
                  <p className="text-xs text-text-light mt-1">{timeAgo(t.updatedAt)}</p>
                </div>
                <ChevronRight size={16} className="text-text-light shrink-0 mt-1"/>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={newModal} onClose={()=>setNewModal(false)} title="New Support Ticket"
        footer={<div className="flex gap-3 justify-end"><button onClick={()=>setNewModal(false)} className="btn-secondary btn-sm">Cancel</button><button onClick={()=>create()} disabled={isPending||!form.subject||!form.description} className="btn-primary btn-sm">{isPending?'Submitting…':'Submit ticket'}</button></div>}>
        <div className="space-y-4">
          <div><label className="label">Subject</label><input className="input" placeholder="Brief description of your issue" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/></div>
          <div><label className="label">Description</label><textarea rows={5} className="input resize-none" placeholder="Please describe your issue in detail…" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
        </div>
      </Modal>
    </GuestHostLayout>
  )
}
