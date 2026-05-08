import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Save } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../../api/usersApi'
import { useAuthStore } from '../../store/authStore'
import GuestHostLayout from '../../components/layout/GuestHostLayout'
import Avatar from '../../components/ui/Avatar'
import toast from 'react-hot-toast'

export default function GuestProfile() {
  const { userId, role, setUser } = useAuthStore()
  const qc = useQueryClient()

  const { data: profile } = useQuery({ queryKey:['user',userId], queryFn:()=>usersApi.getById(userId), enabled:!!userId })
  const [form, setForm] = useState({ name:'', phoneNumber:'', bio:'' })
  const [initialized, setInitialized] = useState(false)

  if (profile && !initialized) { setForm({ name:profile.name||'', phoneNumber:profile.phoneNumber||'', bio:profile.bio||'' }); setInitialized(true) }

  const { mutate: save, isPending } = useMutation({
    mutationFn:()=>usersApi.update(userId, form),
    onSuccess:(data)=>{ setUser(data); toast.success('Profile updated!'); qc.invalidateQueries(['user',userId]) },
    onError:()=>toast.error('Failed to update profile'),
  })

  return (
    <GuestHostLayout role={role}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="page-title mb-8">Edit Profile</h1>
        <div className="card p-8">
          {/* Avatar section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <Avatar name={profile?.name||'User'} size={96}/>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-card border border-border hover:bg-muted transition-colors">
                <Camera size={14} className="text-text-secondary"/>
              </button>
            </div>
            <p className="mt-3 font-bold text-lg">{profile?.name}</p>
            <p className="text-text-secondary text-sm">{profile?.email}</p>
            <div className="flex gap-2 mt-2">
              {profile?.isVerified && <span className="badge badge-green">✓ Verified</span>}
              <span className="badge badge-blue">{profile?.role}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div><label className="label">Full name</label><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name"/></div>
            <div><label className="label">Phone number</label><input className="input" value={form.phoneNumber} onChange={e=>setForm({...form,phoneNumber:e.target.value})} placeholder="+1 555 000 0000"/></div>
            <div><label className="label">Bio</label><textarea rows={3} className="input resize-none" value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} placeholder="Tell hosts a little about yourself…"/></div>

            <div className="pt-2">
              <label className="label text-text-secondary">Email (read-only)</label>
              <input className="input bg-muted cursor-not-allowed" value={profile?.email||''} disabled/>
            </div>

            <button onClick={()=>save()} disabled={isPending} className="btn-primary w-full mt-2">
              <Save size={16}/>{isPending?'Saving…':'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </GuestHostLayout>
  )
}
