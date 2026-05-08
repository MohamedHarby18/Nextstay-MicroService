import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { agentsApi } from '../../api/agentsApi'
import EmployeeLayout from '../../components/layout/EmployeeLayout'
import { AgentRoleBadge } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import SearchBar from '../../components/ui/SearchBar'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import { Users, Plus, UserX, Eye } from 'lucide-react'
import { formatDate } from '../../utils/formatters'
import toast from 'react-hot-toast'

const ROLES = ['SUPPORT_AGENT', 'SUPPORT_LEAD', 'ADMIN']

export default function EmployeesManagement() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [createModal, setCreateModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [newAgent, setNewAgent] = useState({ name: '', email: '', password: '', role: 'SUPPORT_AGENT' })

  const { data: agents = [], isLoading } = useQuery({ queryKey: ['agents', 'all'], queryFn: agentsApi.getAll })

  const filtered = agents.filter(a =>
    !search || a.name?.toLowerCase().includes(search.toLowerCase()) || a.email?.toLowerCase().includes(search.toLowerCase())
  )

  const { mutate: create, isPending: creating } = useMutation({
    mutationFn: () => agentsApi.register(newAgent),
    onSuccess: () => { toast.success('Agent created'); setCreateModal(false); setNewAgent({ name: '', email: '', password: '', role: 'SUPPORT_AGENT' }); qc.invalidateQueries(['agents']) },
    onError: (e) => toast.error(e?.response?.data?.message || 'Failed to create agent'),
  })

  const { mutate: updateRole } = useMutation({
    mutationFn: ({ id, role }) => agentsApi.updateRole(id, role),
    onSuccess: () => { toast.success('Role updated'); qc.invalidateQueries(['agents']); setSelected(null) },
    onError: () => toast.error('Failed to update role'),
  })

  const { mutate: deactivateAgent } = useMutation({
    mutationFn: (id) => agentsApi.deactivate(id),
    onSuccess: () => { toast.success('Agent deactivated'); qc.invalidateQueries(['agents']) },
    onError: () => toast.error('Failed'),
  })

  return (
    <EmployeeLayout sidebarRole="ADMIN_EMPLOYEES">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="page-title">Employees Management</h1><p className="page-subtitle">{agents.length} staff members</p></div>
          <Button onClick={() => setCreateModal(true)}><Plus size={16} /> Add Employee</Button>
        </div>

        <div className="flex gap-3 mb-6">
          <SearchBar placeholder="Search employees…" onSearch={setSearch} className="w-72" />
        </div>

        {isLoading ? <p className="py-12 text-center text-text-secondary">Loading…</p>
          : filtered.length === 0 ? <EmptyState icon={Users} title="No employees found" />
            : (
              <div className="table-container">
                <table className="table">
                  <thead><tr><th>Employee</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filtered.map(a => (
                      <tr key={a.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <Avatar name={a.name || 'Agent'} size={32} />
                            <span className="font-medium text-sm">{a.name}</span>
                          </div>
                        </td>
                        <td><span className="text-sm text-text-secondary">{a.email}</span></td>
                        <td><AgentRoleBadge role={a.role} /></td>
                        <td>{a.isActive !== false ? <span className="badge badge-green">Active</span> : <span className="badge badge-red">Inactive</span>}</td>
                        <td><span className="text-xs text-text-secondary">{formatDate(a.createdAt)}</span></td>
                        <td>
                          <div className="flex gap-1">
                            <button onClick={() => setSelected(a)} className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Manage">
                              <Eye size={15} className="text-text-secondary" />
                            </button>
                            <button onClick={() => { if (confirm('Deactivate this employee?')) deactivateAgent(a.id) }} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Deactivate">
                              <UserX size={15} className="text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
      </div>

      {/* Create agent modal */}
      <Modal open={createModal} onClose={() => setCreateModal(false)} title="Add New Employee"
        footer={<div className="flex gap-3 justify-end"><Button variant="secondary" onClick={() => setCreateModal(false)}>Cancel</Button><Button loading={creating} onClick={() => create()}>Create Employee</Button></div>}>
        <div className="space-y-4">
          <div><label className="label">Full name</label><input className="input" placeholder="Agent name" value={newAgent.name} onChange={e => setNewAgent({ ...newAgent, name: e.target.value })} /></div>
          <div><label className="label">Email</label><input type="email" className="input" placeholder="agent@nextstay.com" value={newAgent.email} onChange={e => setNewAgent({ ...newAgent, email: e.target.value })} /></div>
          <div><label className="label">Password</label><input type="password" className="input" placeholder="Min. 8 characters" value={newAgent.password} onChange={e => setNewAgent({ ...newAgent, password: e.target.value })} /></div>
          <div><label className="label">Role</label>
            <select className="input" value={newAgent.role} onChange={e => setNewAgent({ ...newAgent, role: e.target.value })}>
              {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      {/* Edit role modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Manage Employee" size="sm"
        footer={<Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}>
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={selected.name} size={48} />
              <div>
                <p className="font-bold">{selected.name}</p>
                <p className="text-sm text-text-secondary">{selected.email}</p>
              </div>
            </div>
            <div>
              <label className="label">Change Role</label>
              <select className="input" defaultValue={selected.role} onChange={e => updateRole({ id: selected.id, role: e.target.value })}>
                {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>
        )}
      </Modal>
    </EmployeeLayout>
  )
}
