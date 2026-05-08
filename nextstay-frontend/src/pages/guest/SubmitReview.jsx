import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { reviewsApi } from '../../api/reviewsApi'
import GuestHostLayout from '../../components/layout/GuestHostLayout'
import StarRating from '../../components/ui/StarRating'
import toast from 'react-hot-toast'

export default function SubmitReview() {
  const { reservationId } = useParams()
  const navigate = useNavigate()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const { mutate, isPending } = useMutation({
    mutationFn: () => reviewsApi.submit({ reservationId, rating, comment }),
    onSuccess: () => { toast.success('Review submitted!'); navigate('/guest/reviews') },
    onError: (e) => toast.error(e?.response?.data?.message || 'Failed to submit review.'),
  })

  const labels = {0:'Select rating',1:'Poor',2:'Fair',3:'Good',4:'Very good',5:'Excellent'}

  return (
    <GuestHostLayout role="GUEST">
      <div className="max-w-xl mx-auto px-4 py-8">
        <button onClick={()=>navigate(-1)} className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6">
          <ChevronLeft size={16}/> Back
        </button>
        <div className="card p-8">
          <h1 className="text-2xl font-bold mb-2">Leave a review</h1>
          <p className="text-text-secondary text-sm mb-8">Share your experience to help other travelers</p>

          <div className="mb-8 text-center">
            <StarRating value={rating} interactive onChange={setRating} size={40}/>
            <p className={`mt-3 text-lg font-semibold ${rating>0?'text-text-primary':'text-text-light'}`}>{labels[rating]}</p>
          </div>

          <div className="mb-6">
            <label className="label">Your review</label>
            <textarea rows={5} className="input resize-none" placeholder="Tell future guests what you loved (or didn't love) about this stay…"
              value={comment} onChange={e=>setComment(e.target.value)}/>
            <p className="text-xs text-text-light mt-1 text-right">{comment.length} characters</p>
          </div>

          <button onClick={()=>mutate()} disabled={rating===0||isPending||comment.trim().length<10}
            className="btn-primary w-full disabled:opacity-50">
            {isPending ? 'Submitting…' : 'Submit review'}
          </button>
          {rating===0 && <p className="text-xs text-text-secondary text-center mt-2">Please select a rating</p>}
          {comment.trim().length>0 && comment.trim().length<10 && <p className="text-xs text-text-secondary text-center mt-2">Review must be at least 10 characters</p>}
        </div>
      </div>
    </GuestHostLayout>
  )
}
