import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MapPin, Star, SlidersHorizontal, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { listingsApi } from '../../api/listingsApi'
import GuestHostLayout from '../../components/layout/GuestHostLayout'
import { SkeletonCard } from '../../components/ui/SkeletonLoader'
import { formatCurrency, propertyImage } from '../../utils/formatters'

export default function PropertySearch() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [filters, setFilters] = useState({ minPrice:'', maxPrice:'', location: params.get('location')||'' })
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('default')

  const { data: res, isLoading, refetch } = useQuery({
    queryKey: ['listings','search', filters],
    queryFn: () => listingsApi.search({ location:filters.location||undefined, minPrice:filters.minPrice||undefined, maxPrice:filters.maxPrice||undefined }),
  })

  const rawListings = res?.data || []
  const listings = [...rawListings].sort((a,b) => {
    if (sortBy==='price-asc') return a.pricePerNight-b.pricePerNight
    if (sortBy==='price-desc') return b.pricePerNight-a.pricePerNight
    if (sortBy==='rating') return (b.averageRating||0)-(a.averageRating||0)
    return 0
  })

  return (
    <GuestHostLayout role="GUEST">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{filters.location ? `Stays in ${filters.location}` : 'All available stays'}</h1>
            <p className="text-text-secondary text-sm">{listings.length} properties found</p>
          </div>
          <div className="flex items-center gap-3">
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="input w-auto py-2 text-sm">
              <option value="default">Sort: Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <button onClick={()=>setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors">
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="card p-5 mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Filter results</h3>
              <button onClick={()=>setShowFilters(false)} className="p-1 hover:bg-muted rounded-lg transition-colors"><X size={16}/></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><label className="label">Location</label><input className="input" placeholder="Any location" value={filters.location} onChange={e=>setFilters({...filters,location:e.target.value})}/></div>
              <div><label className="label">Min price / night ($)</label><input type="number" className="input" placeholder="0" value={filters.minPrice} onChange={e=>setFilters({...filters,minPrice:e.target.value})}/></div>
              <div><label className="label">Max price / night ($)</label><input type="number" className="input" placeholder="Any" value={filters.maxPrice} onChange={e=>setFilters({...filters,maxPrice:e.target.value})}/></div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={()=>{setFilters({minPrice:'',maxPrice:'',location:''})}} className="btn-secondary btn-sm">Clear</button>
              <button onClick={()=>refetch()} className="btn-primary btn-sm">Apply</button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({length:8}).map((_,i)=><SkeletonCard key={i}/>)}
          </div>
        ) : listings.length===0 ? (
          <div className="text-center py-24">
            <MapPin size={40} className="mx-auto text-gray-300 mb-4"/>
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-text-secondary">Try adjusting your filters or search in a different location.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((l,idx)=>(
              <div key={l.id} className="property-card" onClick={()=>navigate(`/guest/property/${l.id}`)}>
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img src={propertyImage(l.id||idx,600,400)} alt={l.title} className="property-card-img"/>
                </div>
                <div className="p-4">
                  <div className="flex justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm leading-tight line-clamp-2">{l.title}</h3>
                    <div className="flex items-center gap-1 shrink-0"><Star size={13} className="fill-amber-400 text-amber-400"/><span className="text-xs font-semibold">{l.averageRating?.toFixed(1)||'—'}</span></div>
                  </div>
                  <p className="text-text-secondary text-xs flex items-center gap-1 mb-2"><MapPin size={11}/>{l.location}</p>
                  <p className="text-sm font-bold">{formatCurrency(l.pricePerNight)}<span className="font-normal text-text-secondary"> / night</span></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GuestHostLayout>
  )
}