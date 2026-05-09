import { useState } from 'react'
import { CheckCircle, XCircle, Home, Eye } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listingsApi } from '../../api/listingsApi'
import EmployeeLayout from '../../components/layout/EmployeeLayout'
import { ListingBadge } from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import Tabs from '../../components/ui/Tabs'
import toast from 'react-hot-toast'
import { propertyImage, formatCurrency } from '../../utils/formatters'

// Fixed mapping to perfectly match the backend enum
const STATUSES = ['INACTIVE', 'ACTIVE', 'REJECTED']

export default function AdminListings() {
  const qc = useQueryClient()
  
  // Set default tab to the new INACTIVE string
  const [tab, setTab] = useState('INACTIVE')

  const { data: res, isLoading } = useQuery({ queryKey: ['admin', 'listings'], queryFn: listingsApi.getAll })
  const allListings = res?.data || []
  const filtered = allListings.filter(l => l.status === tab)

  const tabs = STATUSES.map(s => ({
    id: s,
    label: s.charAt(0) + s.slice(1).toLowerCase(),
    count: allListings.filter(l => l.status === s).length
  }))

  const { mutate: verifyListing } = useMutation({
    mutationFn: ({ id, status }) => listingsApi.verify(id, { status }),
    onSuccess: () => { toast.success('Listing status updated!'); qc.invalidateQueries(['admin', 'listings']) },
    onError: () => toast.error('Failed to update listing status')
  })

  return (
    <EmployeeLayout sidebarRole="ADMIN_USERS">
      <div className="max-w-6xl mx-auto">
        <div className="page-header">
          <h1 className="page-title">Property Approvals</h1>
          <p className="page-subtitle">Review and verify new host listings before they go live</p>
        </div>

        <div className="overflow-x-auto mb-6">
          <Tabs tabs={tabs} defaultTab="INACTIVE" onChange={setTab} />
        </div>

        {isLoading ? <p className="py-12 text-center text-text-secondary">Loading…</p>
          : filtered.length === 0 ? <EmptyState icon={Home} title={`No ${tab.toLowerCase()} listings`} description="All caught up!" />
          : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((l, i) => (
                <div key={l.id} className="card overflow-hidden flex flex-col">
                  <div className="relative h-48">
                    <img src={propertyImage(l.id || i, 600, 400)} alt={l.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3"><ListingBadge status={l.status} /></div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg leading-tight">{l.title}</h3>
                      <p className="font-bold text-usersAdmin-500 whitespace-nowrap ml-2">{formatCurrency(l.pricePerNight)}<span className="text-xs font-normal text-text-secondary">/nt</span></p>
                    </div>
                    <p className="text-sm text-text-secondary mb-4 line-clamp-2">{l.description}</p>

                    <div className="mt-auto pt-4 border-t border-border flex gap-2">
                      {/* Fixed condition to match the new INACTIVE string */}
                      {tab === 'INACTIVE' ? (
                        <>
                          <button onClick={() => verifyListing({ id: l.id, status: 'ACTIVE' })} className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors">
                            <CheckCircle size={16} /> Approve
                          </button>
                          <button onClick={() => verifyListing({ id: l.id, status: 'REJECTED' })} className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors">
                            <XCircle size={16} /> Reject
                          </button>
                        </>
                      ) : (
                        <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-text-secondary py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
                          <Eye size={16} /> View Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </EmployeeLayout>
  )
}