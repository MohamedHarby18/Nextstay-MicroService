import { Star } from 'lucide-react'

export default function StarRating({ value = 0, max = 5, interactive = false, onChange, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <button
          key={i}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => onChange?.(i + 1) : undefined}
          className={interactive ? 'transition-transform hover:scale-110' : 'cursor-default'}
        >
          <Star
            size={size}
            className={i < value ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-300'}
          />
        </button>
      ))}
      {!interactive && value > 0 && (
        <span className="ml-1 text-xs font-semibold text-text-secondary">{Number(value).toFixed(1)}</span>
      )}
    </div>
  )
}
