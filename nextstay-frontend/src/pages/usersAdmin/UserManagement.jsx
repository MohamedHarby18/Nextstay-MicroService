import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../../api/usersApi'
import EmployeeLayout from '../../components/layout/EmployeeLayout'
import { UserStatusBadge } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import SearchBar from '../../components/ui/SearchBar'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import { Users, Flag, ShieldOff, ShieldCheck, UserX, Eye } from 'lucide-react'
import { formatDate } from '../../utils/formatters'
import toast from 'react-hot-toast'

export default function UserManagement() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const { data: users = [], isLoading } = useQuery({ 
    queryKey: ['users', 'all'], 
    queryFn: usersApi.getAll 
  })

  const filtered = users.filter(u =>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const { mutate: flag } = useMutation({ 
    mutationFn: (id) => usersApi.flag(id), 
    onSuccess: () => { 
      toast.success('User flagged'); 
      qc.invalidateQueries(['users']) 
    } 
  })
  
  const { mutate: unflag } = useMutation({ 
    mutationFn: (id) => usersApi.unflag(id), 
    onSuccess: () => { 
      toast.success('Flag removed'); 
      qc.invalidateQueries(['users']) 
    } 
  })
  
  const { mutate: deactivate } = useMutation({ 
    mutationFn: (id) => usersApi.deactivate(id), 
    onSuccess: () => { 
      toast.success('User deactivated'); 
      qc.invalidateQueries(['users']) 
    } 
  })
  
  const { mutate: reactivate } = useMutation({ 
    mutationFn: (id) => usersApi.reactivate(id), 
    onSuccess: () => { 
      toast.success('User reactivated'); 
      qc.invalidateQueries(['users']) 
    } 
  })

  return (
    <EmployeeLayout sidebarRole="ADMIN_USERS">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="page-title">User Management</h1>
            <p className="page-subtitle">{users.length} registered users</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <SearchBar placeholder="Search by name or email…" onSearch={setSearch} className="w-72" />
        </div>

        {isLoading ? <p className="py-12 text-center text-text-secondary">Loading…</p>
          : filtered.length === 0 ? <EmptyState icon={Users} title="No users found" />
            : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <Avatar name={u.name || 'User'} size={32} />
                            <span className="font-medium text-sm">{u.name}</span>
                          </div>
                        </td>
                        <td><span className="text-sm text-text-secondary">{u.email}</span></td>
                        <td><span className="badge badge-blue">{u.role}</span></td>
                        <td><UserStatusBadge user={u} /></td>
                        <td><span className="text-xs text-text-secondary">{formatDate(u.createdAt)}</span></td>
                        <td>
                          <div className="flex gap-1">
                            <button onClick={() => setSelected(u)} className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="View details">
                              <Eye size={15} className="text-text-secondary" />
                            </button>
                            {u.isFlagged
                              ? <button onClick={() => unflag(u.id)} className="p-1.5 hover:bg-emerald-50 rounded-lg transition-colors" title="Remove flag"><ShieldCheck size={15} className="text-emerald-600" /></button>
                              : <button onClick={() => flag(u.id)} className="p-1.5 hover:bg-amber-50 rounded-lg transition-colors" title="Flag user"><Flag size={15} className="text-amber-600" /></button>
                            }
                            {u.isActive
                              ? <button onClick={() => deactivate(u.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Deactivate"><UserX size={15} className="text-red-500" /></button>
                              : <button onClick={() => reactivate(u.id)} className="p-1.5 hover:bg-emerald-50 rounded-lg transition-colors" title="Reactivate"><ShieldCheck size={15} className="text-emerald-600" /></button>
                            }
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
      </div>

      {/* User detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="User Details" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={selected.name} size={56} />
              <div>
                <p className="font-bold text-lg">{selected.name}</p>
                <p className="text-text-secondary text-sm">{selected.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { l: 'Role', v: selected.role },
                { l: 'Phone', v: selected.phoneNumber || '—' },
                // REMOVED: Verified field to align with listing-level verification workflow
                { l: 'Active', v: selected.isActive ? 'Yes' : 'No' },
                { l: 'Flagged', v: selected.isFlagged ? 'Yes' : 'No' },
                { l: 'Joined', v: formatDate(selected.createdAt) },
              ].map(({ l, v }) => (
                <div key={l}>
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">{l}</p>
                  <p className="font-medium mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </EmployeeLayout>
  )
}