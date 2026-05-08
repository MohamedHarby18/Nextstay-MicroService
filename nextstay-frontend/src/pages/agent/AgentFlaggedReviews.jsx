import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewsApi } from '../../api/reviewsApi'
import { listingsApi } from '../../api/listingsApi'
import EmployeeLayout from '../../components/layout/EmployeeLayout'
import StarRating from '../../components/ui/StarRating'
import EmptyState from '../../components/ui/EmptyState'
import { Flag, Star } from 'lucide-react'
import { timeAgo } from '../../utils/formatters'
import toast from 'react-hot-toast'

export default function AgentFlaggedReviews() {
  const qc = useQueryClient()

  // Get all listings then all reviews to find flaggable ones
  const { data: listingsRes } = useQuery({ queryKey: ['listings', 'all'], queryFn: listingsApi.getAll })
  const listings = listingsRes?.data || []

  const { data: allReviews = [], isLoading } = useQuery({
    queryKey: ['reviews', 'all-for-flagging'],
    queryFn: async () => {
      const results = await Promise.all(listings.slice(0, 20).map(l => reviewsApi.getByListing(l.id).catch(() => [])))
      return results.flat()
    },
    enabled: listings.length > 0,
  })

  const { mutate: flag } = useMutation({
    mutationFn: (id) => reviewsApi.flag(id),
    onSuccess: () => { toast.success('Review flagged'); qc.invalidateQueries(['reviews']) },
    onError: () => toast.error('Failed to flag review'),
  })

  return (
    <EmployeeLayout sidebarRole="SUPPORT_AGENT">
      <div className="max-w-4xl mx-auto">
        <div className="page-header"><h1 className="page-title">Review Moderation</h1><p className="page-subtitle">Flag inappropriate or policy-violating reviews</p></div>

        {isLoading ? <p className="py-12 text-center text-text-secondary">Loading…</p>
          : allReviews.length === 0 ? <EmptyState icon={Star} title="No reviews to moderate" />
            : (
              <div className="space-y-3">
                {allReviews.map(r => (
                  <div key={r.id} className="card p-5 flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <StarRating value={r.rating} size={14} />
                        {r.isFlagged && <span className="badge badge-red">Flagged</span>}
                        <span className="text-xs text-text-light">{timeAgo(r.createdAt)}</span>
                      </div>
                      <p className="text-sm text-text-secondary mt-1">{r.comment}</p>
                    </div>
                    {!r.isFlagged && (
                      <button onClick={() => flag(r.id)} className="flex items-center gap-1 px-3 py-1.5 border border-red-300 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors shrink-0">
                        <Flag size={13} /> Flag
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
      </div>
    </EmployeeLayout>
  )
}
