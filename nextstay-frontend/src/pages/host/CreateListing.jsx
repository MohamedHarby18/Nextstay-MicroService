import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { listingsApi } from '../../api/listingsApi'
import GuestHostLayout from '../../components/layout/GuestHostLayout'
import toast from 'react-hot-toast'

const AMENITIES = ['WiFi','Air conditioning','Kitchen','Free parking','Swimming pool','Gym','Pet friendly','Washer/Dryer','TV','Workspace','Hot tub','BBQ grill','Fireplace','Beach access']
const STEPS = ['Basic Info','Amenities','Pricing & Guests','Review']

export default function CreateListing() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ title:'', description:'', location:'', pricePerNight:'', maxGuests:2, amenities:[] })

  const { mutate: create, isPending } = useMutation({
    mutationFn:()=>listingsApi.create({ ...form, pricePerNight:parseFloat(form.pricePerNight), maxGuests:parseInt(form.maxGuests) }),
    onSuccess:()=>{ toast.success('Listing created!'); navigate('/host/listings') },
    onError:(e)=>toast.error(e?.response?.data?.message||'Failed to create listing'),
  })

  const toggle = (a) => setForm(p=>({...p, amenities:p.amenities.includes(a)?p.amenities.filter(x=>x!==a):[...p.amenities,a]}))
  const canNext = [form.title&&form.description&&form.location, true, form.pricePerNight&&form.maxGuests, true]

  return (
    <GuestHostLayout role="HOST">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={()=>navigate('/host/listings')} className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6">
          <ArrowLeft size={16}/> My Listings
        </button>
        <h1 className="text-2xl font-bold mb-8">Create a new listing</h1>

        {/* Step progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s,i)=>(
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${i<step?'bg-host-accent text-white':i===step?'bg-host-500 text-white':'bg-gray-200 text-text-secondary'}`}>
                {i<step?<Check size={14}/>:i+1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i===step?'text-host-500':'text-text-secondary'}`}>{s}</span>
              {i<STEPS.length-1&&<div className={`flex-1 h-0.5 ${i<step?'bg-host-accent':'bg-gray-200'}`}/>}
            </div>
          ))}
        </div>

        <div className="card p-8">
          {/* Step 0: Basic Info */}
          {step===0 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold mb-4">Tell us about your place</h2>
              <div><label className="label">Title <span className="text-red-500">*</span></label><input className="input" placeholder="Cozy studio in city center" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
              <div><label className="label">Description <span className="text-red-500">*</span></label><textarea rows={4} className="input resize-none" placeholder="Describe what makes your place special…" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
              <div><label className="label">Location <span className="text-red-500">*</span></label><input className="input" placeholder="City, Country" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></div>
            </div>
          )}

          {/* Step 1: Amenities */}
          {step===1 && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold mb-2">What amenities do you offer?</h2>
              <p className="text-text-secondary text-sm mb-6">Select all that apply</p>
              <div className="grid grid-cols-2 gap-3">
                {AMENITIES.map(a=>(
                  <button type="button" key={a} onClick={()=>toggle(a)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-sm font-medium transition-all text-left ${form.amenities.includes(a)?'border-host-500 bg-host-50 text-host-500':'border-border text-text-secondary hover:border-gray-300'}`}>
                    {form.amenities.includes(a)&&<Check size={15} className="shrink-0"/>}
                    {a}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Pricing */}
          {step===2 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-lg font-bold mb-4">Set your price & capacity</h2>
              <div>
                <label className="label">Price per night (USD) <span className="text-red-500">*</span></label>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-semibold">$</span>
                  <input type="number" className="input pl-8" placeholder="99" min="1" value={form.pricePerNight} onChange={e=>setForm({...form,pricePerNight:e.target.value})}/>
                </div>
              </div>
              <div>
                <label className="label">Maximum guests <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={()=>setForm(p=>({...p,maxGuests:Math.max(1,p.maxGuests-1)}))} className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center text-lg hover:border-host-500 transition-colors">−</button>
                  <span className="text-2xl font-bold w-8 text-center">{form.maxGuests}</span>
                  <button type="button" onClick={()=>setForm(p=>({...p,maxGuests:Math.min(20,p.maxGuests+1)}))} className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center text-lg hover:border-host-500 transition-colors">+</button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step===3 && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold mb-6">Review your listing</h2>
              <div className="space-y-4">
                {[{label:'Title',val:form.title},{label:'Location',val:form.location},{label:'Price',val:`$${form.pricePerNight}/night`},{label:'Max guests',val:form.maxGuests},{label:'Amenities',val:form.amenities.join(', ')||'None'}].map(({label,val})=>(
                  <div key={label} className="flex gap-4 py-3 border-b border-border last:border-0">
                    <span className="text-text-secondary text-sm w-28 shrink-0">{label}</span>
                    <span className="text-text-primary text-sm font-medium">{val}</span>
                  </div>
                ))}
                <div className="py-3"><span className="text-text-secondary text-sm">Description</span><p className="text-text-primary text-sm font-medium mt-1">{form.description}</p></div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-border">
            {step>0 && <button onClick={()=>setStep(s=>s-1)} className="btn-secondary flex-1"><ArrowLeft size={16}/>Back</button>}
            {step<STEPS.length-1
              ? <button onClick={()=>setStep(s=>s+1)} disabled={!canNext[step]} className="btn-primary flex-1 disabled:opacity-50">Next<ArrowRight size={16}/></button>
              : <button onClick={()=>create()} disabled={isPending} className="btn-primary flex-1"><Check size={16}/>{isPending?'Creating…':'Create listing'}</button>
            }
          </div>
        </div>
      </div>
    </GuestHostLayout>
  )
}
