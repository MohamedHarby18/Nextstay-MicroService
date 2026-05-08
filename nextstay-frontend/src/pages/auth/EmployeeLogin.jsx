import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, Shield } from 'lucide-react'
import { authApi } from '../../api/authApi'
import { useAuthStore } from '../../store/authStore'
import { agentsApi } from '../../api/agentsApi'
import toast from 'react-hot-toast'

const ROLE_LABELS = {
  SUPPORT_AGENT: { label:'Support Agent',    desc:'Handle customer tickets and flagged content', landing:'/agent/tickets',        bg:'bg-agent-500' },
  SUPPORT_LEAD:  { label:'Support Lead',     desc:'Manage the support team and escalations',    landing:'/agent/tickets',        bg:'bg-agent-600' },
  ADMIN_USERS:   { label:"Users' Admin",     desc:'Manage users, listings and refunds',          landing:'/users-admin/users',    bg:'bg-usersAdmin-500' },
  ADMIN_EMP:     { label:"Employees' Admin", desc:'Manage support staff and ticket assignment',  landing:'/emp-admin/employees',  bg:'bg-empAdmin-500' },
}

export default function EmployeeLogin() {
  const navigate = useNavigate()
  const { login, setUser } = useAuthStore()
  const [form, setForm] = useState({ email:'', password:'' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const res = await authApi.agentLogin(form)
      // Determine sidebarRole from AgentRole
      const agentRole = res.role
      let sidebarRole = agentRole
      if (agentRole === 'ADMIN') sidebarRole = 'ADMIN_EMPLOYEES'
      login({ ...res, role: sidebarRole }, 'agent')
      try {
        const profile = await agentsApi.getById(res.userId)
        setUser(profile)
      } catch {}
      toast.success('Welcome back!')
      const landing = {
        SUPPORT_AGENT: '/agent/tickets',
        SUPPORT_LEAD:  '/agent/tickets',
        ADMIN_EMPLOYEES: '/emp-admin/employees',
      }[sidebarRole] || '/agent/tickets'
      navigate(landing)
    } catch (err) {
      console.error('Employee login error:', err)
      if (!err.response) {
        toast.error('Cannot reach the server. Make sure the backend is running (docker compose up).')
      } else {
        toast.error(err.response.data?.message || err.response.data?.error || 'Invalid credentials.')
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — dark panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-usersAdmin-500 flex-col justify-center px-12 py-16">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center"><span className="text-white font-bold">N</span></div>
          <span className="text-xl font-bold text-white">NextStay</span>
          <span className="text-white/50 text-sm ml-1">Staff Portal</span>
        </div>
        <div className="w-14 h-14 bg-usersAdmin-accent/20 rounded-3xl flex items-center justify-center mb-6">
          <Shield size={30} className="text-usersAdmin-accent" />
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">Employee Access</h2>
        <p className="text-white/60 text-lg mb-10">Internal portal for NextStay staff only.</p>
        <div className="space-y-3">
          {Object.values(ROLE_LABELS).map(r => (
            <div key={r.label} className="flex items-start gap-3 bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="w-2 h-2 bg-usersAdmin-accent rounded-full mt-1.5 shrink-0" />
              <div>
                <p className="text-white font-semibold text-sm">{r.label}</p>
                <p className="text-white/50 text-xs">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="card p-8">
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <Shield size={20} className="text-usersAdmin-accent" />
              <span className="font-bold text-text-primary">Staff Portal</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">Staff Sign In</h1>
            <p className="text-text-secondary text-sm mb-8">Use your NextStay employee credentials</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email address</label>
                <input type="email" className="input" placeholder="staff@nextstay.com" required
                  value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input type={show?'text':'password'} className="input pr-12" placeholder="••••••••" required
                    value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
                  <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light">
                    {show?<EyeOff size={18}/>:<Eye size={18}/>}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-usersAdmin-500 text-white font-semibold rounded-xl hover:bg-usersAdmin-600 transition-all duration-200 active:scale-95 disabled:opacity-50">
                {loading
                  ? <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  : <><span>Sign in</span><ArrowRight size={18}/></>
                }
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-xs text-text-light">Guest or Host?{' '}
                <a href="/login" className="text-brand-500 font-semibold hover:underline">Sign in here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
