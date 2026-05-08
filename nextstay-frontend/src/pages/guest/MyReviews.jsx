import { useNavigate } from 'react-router-dom'
import { Star, Trash2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewsApi } from '../../api/reviewsApi'
import { useAuthStore } from '../../store/authStore'
import GuestHostLayout from '../../components/layout/GuestHostLayout'
import StarRating from '../../components/ui/StarRating'
import EmptyState from '../../components/ui/EmptyState'
import { SkeletonCard } from '../../components/ui/SkeletonLoader'
import { timeAgo } from '../../utils/formatters'
import toast from 'react-hot-toast'

export default function MyReviews() {
  const { userId } = useAuthStore()
  const qc = useQueryClient()

  const { data:reviews=[], isLoading } = useQuery({
    queryKey:['reviews','guest',userId],
    queryFn:()=>reviewsApi.getByGuest(userId),
    enabled:!!userId,
  })

  const { mutate: del } = useMutation({
    mutationFn:(id)=>reviewsApi.delete(id),
    onSuccess:()=>{ toast.success('Review deleted'); qc.invalidateQueries(['reviews','guest',userId]) },
  })

  return (
    <GuestHostLayout role="GUEST">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="page-header">
          <h1 className="page-title">My Reviews</h1>
          <p className="page-subtitle">Reviews you've left for your stays</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">{Array.from({length:3}).map((_,i)=><SkeletonCard key={i}/>)}</div>
        ) : reviews.length===0 ? (
          <EmptyState icon={Star} title="No reviews yet" description="After completing a stay, you can leave a review for the host."/>
        ) : (
          <div className="space-y-4">
            {reviews.map(r=>(
              <div key={r.id} className="card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <StarRating value={r.rating} size={16}/>
                      {r.isFlagged && <span className="badge badge-red">Flagged</span>}
                    </div>
                    <p className="text-text-primary text-sm leading-relaxed mb-2">{r.comment}</p>
                    <p className="text-xs text-text-secondary">{timeAgo(r.createdAt)}</p>
                  </div>
                  <button onClick={()=>del(r.id)} className="p-2 rounded-xl hover:bg-red-50 transition-colors text-text-light hover:text-red-500">
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GuestHostLayout>
  )
}
