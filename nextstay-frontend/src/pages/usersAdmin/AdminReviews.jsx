import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewsApi } from '../../api/reviewsApi'
import { listingsApi } from '../../api/listingsApi'
import EmployeeLayout from '../../components/layout/EmployeeLayout'
import StarRating from '../../components/ui/StarRating'
import EmptyState from '../../components/ui/EmptyState'
import { Star, Trash2, Flag } from 'lucide-react'
import { timeAgo } from '../../utils/formatters'
import toast from 'react-hot-toast'

export default function AdminReviews() {
  const qc = useQueryClient()

  const { data: listingsRes } = useQuery({ queryKey: ['listings', 'all'], queryFn: listingsApi.getAll })
  const listings = listingsRes?.data || []

  const { data: allReviews = [], isLoading } = useQuery({
    queryKey: ['reviews', 'admin-all'],
    queryFn: async () => {
      const results = await Promise.all(listings.slice(0, 30).map(l => reviewsApi.getByListing(l.id).catch(() => [])))
      return results.flat()
    },
    enabled: listings.length > 0,
  })

  const { mutate: flag } = useMutation({
    mutationFn: (id) => reviewsApi.flag(id),
    onSuccess: () => { toast.success('Review flagged'); qc.invalidateQueries(['reviews']) },
  })
  const { mutate: del } = useMutation({
    mutationFn: (id) => reviewsApi.delete(id),
    onSuccess: () => { toast.success('Review deleted'); qc.invalidateQueries(['reviews']) },
  })

  const flagged = allReviews.filter(r => r.isFlagged)
  const normal = allReviews.filter(r => !r.isFlagged)

  return (
    <EmployeeLayout sidebarRole="ADMIN_USERS">
      <div className="max-w-4xl mx-auto">
        <div className="page-header"><h1 className="page-title">Host Ratings & Reviews</h1><p className="page-subtitle">Oversee and moderate guest reviews</p></div>

        {flagged.length > 0 && (
          <div className="mb-8">
            <h2 className="font-bold text-red-600 mb-3 flex items-center gap-2"><Flag size={16} /> Flagged Reviews ({flagged.length})</h2>
            <div className="space-y-3">
              {flagged.map(r => (
                <div key={r.id} className="card p-5 border-l-4 border-l-red-400">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <StarRating value={r.rating} size={14} />
                        <span className="badge badge-red">Flagged</span>
                        <span className="text-xs text-text-light">{timeAgo(r.createdAt)}</span>
                      </div>
                      <p className="text-sm text-text-secondary mt-1">{r.comment}</p>
                    </div>
                    <button onClick={() => del(r.id)} className="p-2 hover:bg-red-50 rounded-xl text-red-500 transition-colors" title="Delete review">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 className="font-bold mb-3">All Reviews ({normal.length})</h2>
        {isLoading ? <p className="py-8 text-center text-text-secondary">Loading…</p>
          : normal.length === 0 ? <EmptyState icon={Star} title="No reviews" />
            : (
              <div className="space-y-3">
                {normal.map(r => (
                  <div key={r.id} className="card p-5 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <StarRating value={r.rating} size={14} />
                        <span className="text-xs text-text-light">{timeAgo(r.createdAt)}</span>
                      </div>
                      <p className="text-sm text-text-secondary">{r.comment}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => flag(r.id)} className="p-2 hover:bg-amber-50 rounded-xl text-amber-600 transition-colors" title="Flag"><Flag size={15} /></button>
                      <button onClick={() => del(r.id)} className="p-2 hover:bg-red-50 rounded-xl text-red-500 transition-colors" title="Delete"><Trash2 size={15} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
      </div>
    </EmployeeLayout>
  )
}
