import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit2, Trash2, Eye, LayoutGrid, List, MapPin, Star } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listingsApi } from '../../api/listingsApi'
import { useAuthStore } from '../../store/authStore'
import GuestHostLayout from '../../components/layout/GuestHostLayout'
import { ListingBadge } from '../../components/ui/Badge'
import { SkeletonCard } from '../../components/ui/SkeletonLoader'
import EmptyState from '../../components/ui/EmptyState'
import SearchBar from '../../components/ui/SearchBar'
import { formatCurrency, propertyImage } from '../../utils/formatters'
import toast from 'react-hot-toast'

export default function MyListings() {
  const { userId } = useAuthStore()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [view, setView] = useState('grid')
  const [search, setSearch] = useState('')

  const { data: res, isLoading } = useQuery({ queryKey:['listings','host',userId], queryFn:()=>listingsApi.getByHost(userId), enabled:!!userId })
  const listings = (res?.data||[]).filter(l=>l.title?.toLowerCase().includes(search.toLowerCase())||l.location?.toLowerCase().includes(search.toLowerCase()))

  const { mutate: del } = useMutation({
    mutationFn:(id)=>listingsApi.delete(id),
    onSuccess:()=>{ toast.success('Listing deleted'); qc.invalidateQueries(['listings','host',userId]) },
    onError:()=>toast.error('Failed to delete listing'),
  })

  return (
    <GuestHostLayout role="HOST">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div><h1 className="page-title">My Listings</h1><p className="page-subtitle">{listings.length} properties</p></div>
          <button onClick={()=>navigate('/host/listings/create')} className="btn-primary"><Plus size={16}/>Add listing</button>
        </div>

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <SearchBar placeholder="Search listings…" onSearch={setSearch} className="flex-1 max-w-xs"/>
          <div className="flex gap-1 p-1 bg-muted rounded-xl">
            <button onClick={()=>setView('grid')} className={`p-2 rounded-lg transition-colors ${view==='grid'?'bg-white shadow-sm':''}`}><LayoutGrid size={16}/></button>
            <button onClick={()=>setView('list')} className={`p-2 rounded-lg transition-colors ${view==='list'?'bg-white shadow-sm':''}`}><List size={16}/></button>
          </div>
        </div>

        {isLoading ? (
          <div className={view==='grid'?'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6':'space-y-4'}>
            {Array.from({length:6}).map((_,i)=><SkeletonCard key={i}/>)}
          </div>
        ) : listings.length===0 ? (
          <EmptyState icon={Plus} title="No listings yet" description="Create your first listing and start hosting guests."
            action={<button onClick={()=>navigate('/host/listings/create')} className="btn-primary btn-sm">Create listing</button>}/>
        ) : view==='grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l,i)=>(
              <div key={l.id} className="card-hover overflow-hidden group">
                <div className="relative overflow-hidden">
                  <img src={propertyImage(l.id||i,600,400)} alt={l.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"/>
                  <div className="absolute top-3 left-3"><ListingBadge status={l.status}/></div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-text-primary mb-1 truncate">{l.title}</h3>
                  <p className="text-xs text-text-secondary flex items-center gap-1 mb-1"><MapPin size={11}/>{l.location}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-bold">{formatCurrency(l.pricePerNight)}<span className="font-normal text-text-secondary text-xs"> /night</span></p>
                    <div className="flex items-center gap-1 text-xs font-semibold"><Star size={12} className="fill-amber-400 text-amber-400"/>{l.averageRating?.toFixed(1)||'—'}</div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={()=>navigate(`/host/listings/${l.id}`)} className="btn-ghost btn-sm flex-1 text-xs"><Eye size={13}/>View</button>
                    <button onClick={()=>navigate(`/host/listings/${l.id}/edit`)} className="btn-ghost btn-sm flex-1 text-xs"><Edit2 size={13}/>Edit</button>
                    <button onClick={()=>{if(confirm('Delete this listing?'))del(l.id)}} className="btn-ghost btn-sm text-red-500 hover:bg-red-50 text-xs"><Trash2 size={13}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((l,i)=>(
              <div key={l.id} className="card-hover p-4 flex items-center gap-4">
                <img src={propertyImage(l.id||i,200,200)} alt="" className="w-16 h-16 rounded-2xl object-cover shrink-0"/>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1"><h3 className="font-bold truncate">{l.title}</h3><ListingBadge status={l.status}/></div>
                  <p className="text-xs text-text-secondary flex items-center gap-1"><MapPin size={11}/>{l.location}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm">{formatCurrency(l.pricePerNight)}/night</p>
                  <div className="flex items-center gap-1 text-xs font-semibold justify-end mt-1"><Star size={12} className="fill-amber-400 text-amber-400"/>{l.averageRating?.toFixed(1)||'—'}</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={()=>navigate(`/host/listings/${l.id}/edit`)} className="p-2 hover:bg-muted rounded-xl transition-colors"><Edit2 size={15}/></button>
                  <button onClick={()=>{if(confirm('Delete?'))del(l.id)}} className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors"><Trash2 size={15}/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GuestHostLayout>
  )
}
