import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewsApi } from '../../api/reviewsApi'
import { listingsApi } from '../../api/listingsApi'
import { useAuthStore } from '../../store/authStore'
import GuestHostLayout from '../../components/layout/GuestHostLayout'
import StarRating from '../../components/ui/StarRating'
import Avatar from '../../components/ui/Avatar'
import EmptyState from '../../components/ui/EmptyState'
import { timeAgo } from '../../utils/formatters'
import { Star, Send } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function HostReviews() {
  const { userId } = useAuthStore()
  const qc = useQueryClient()

  const { data: listingsRes } = useQuery({ queryKey: ['listings', 'host', userId], queryFn: () => listingsApi.getByHost(userId), enabled: !!userId })
  const listings = listingsRes?.data || []
  const listingIds = listings.map(l => l.id)

  // Fetch reviews for all host listings
  const reviewQueries = useQuery({
    queryKey: ['reviews', 'host-listings', listingIds.join(',')],
    queryFn: async () => {
      const all = await Promise.all(listingIds.map(id => reviewsApi.getByListing(id).catch(() => [])))
      return all.flat()
    },
    enabled: listingIds.length > 0,
  })

  const reviews = reviewQueries.data || []
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')

  const { mutate: sendReply, isPending } = useMutation({
    mutationFn: () => reviewsApi.addResponse(replyingTo, { responseText: replyText }),
    onSuccess: () => { toast.success('Response posted!'); setReplyingTo(null); setReplyText(''); qc.invalidateQueries(['reviews']) },
    onError: () => toast.error('Failed to post response'),
  })

  return (
    <GuestHostLayout role="HOST">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="page-header">
          <h1 className="page-title">Reviews & Responses</h1>
          <p className="page-subtitle">Reviews from guests who stayed at your properties</p>
        </div>

        {reviews.length === 0 ? (
          <EmptyState icon={Star} title="No reviews yet" description="Guest reviews will appear here after completed stays." />
        ) : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="card p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar name="Guest" size={40} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">Guest</p>
                      <span className="text-xs text-text-light">{timeAgo(r.createdAt)}</span>
                      {r.isFlagged && <span className="badge badge-red">Flagged</span>}
                    </div>
                    <StarRating value={r.rating} size={14} />
                    <p className="text-sm text-text-secondary mt-2 leading-relaxed">{r.comment}</p>
                  </div>
                </div>

                {/* Reply section */}
                {replyingTo === r.id ? (
                  <div className="ml-12 mt-3 flex gap-3 animate-fade-in">
                    <input className="input flex-1 text-sm" placeholder="Write your response…" value={replyText} onChange={e => setReplyText(e.target.value)} />
                    <button onClick={() => sendReply()} disabled={isPending || !replyText.trim()} className="btn-primary btn-sm"><Send size={14} /></button>
                    <button onClick={() => setReplyingTo(null)} className="btn-ghost btn-sm text-text-secondary">Cancel</button>
                  </div>
                ) : (
                  <div className="ml-12 mt-2">
                    <button onClick={() => { setReplyingTo(r.id); setReplyText('') }} className="text-sm text-host-accent font-semibold hover:underline">
                      Reply to this review
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </GuestHostLayout>
  )
}
