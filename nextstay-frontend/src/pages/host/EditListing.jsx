import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listingsApi } from '../../api/listingsApi'
import GuestHostLayout from '../../components/layout/GuestHostLayout'
import { SkeletonText } from '../../components/ui/SkeletonLoader'
import toast from 'react-hot-toast'

const AMENITIES = ['WiFi', 'Air conditioning', 'Kitchen', 'Free parking', 'Swimming pool', 'Gym', 'Pet friendly', 'Washer/Dryer', 'TV', 'Workspace', 'Hot tub', 'BBQ grill']

export default function EditListing() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: res, isLoading } = useQuery({ queryKey: ['listing', id], queryFn: () => listingsApi.getById(id) })
  const listing = res?.data

  const [form, setForm] = useState({ title: '', description: '', location: '', pricePerNight: '', maxGuests: 2, amenities: [] })
  const [init, setInit] = useState(false)

  useEffect(() => {
    if (listing && !init) {
      setForm({
        title: listing.title || '',
        description: listing.description || '',
        location: listing.location || '',
        pricePerNight: listing.pricePerNight || '',
        maxGuests: listing.maxGuests || 2,
        amenities: listing.amenities || [],
      })
      setInit(true)
    }
  }, [listing, init])

  const toggle = (a) => setForm(p => ({ ...p, amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a] }))

  const { mutate: save, isPending } = useMutation({
    mutationFn: () => listingsApi.update(id, { ...form, pricePerNight: parseFloat(form.pricePerNight), maxGuests: parseInt(form.maxGuests) }),
    onSuccess: () => { toast.success('Listing updated!'); qc.invalidateQueries(['listing', id]); navigate('/host/listings') },
    onError: (e) => toast.error(e?.response?.data?.message || 'Failed to update'),
  })

  if (isLoading) return <GuestHostLayout role="HOST"><div className="max-w-2xl mx-auto px-4 py-8"><SkeletonText lines={8} /></div></GuestHostLayout>

  return (
    <GuestHostLayout role="HOST">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => navigate('/host/listings')} className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6">
          <ArrowLeft size={16} /> My Listings
        </button>
        <h1 className="text-2xl font-bold mb-8">Edit Listing</h1>

        <div className="card p-8 space-y-5">
          <div>
            <label className="label">Title</label>
            <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea rows={4} className="input resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="label">Location</label>
            <input className="input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Price / night ($)</label>
              <input type="number" className="input" min="1" value={form.pricePerNight} onChange={e => setForm({ ...form, pricePerNight: e.target.value })} />
            </div>
            <div>
              <label className="label">Max guests</label>
              <input type="number" className="input" min="1" max="20" value={form.maxGuests} onChange={e => setForm({ ...form, maxGuests: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map(a => (
                <button type="button" key={a} onClick={() => toggle(a)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${form.amenities.includes(a) ? 'bg-brand-500 text-white border-brand-500' : 'border-border text-text-secondary hover:border-gray-400'}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <button onClick={() => navigate('/host/listings')} className="btn-secondary flex-1">Cancel</button>
            <button onClick={() => save()} disabled={isPending} className="btn-primary flex-1">
              <Save size={16} /> {isPending ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </GuestHostLayout>
  )
}
