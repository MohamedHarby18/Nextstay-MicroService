import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-1 py-4">
      <button onClick={() => onChange(page - 1)} disabled={page <= 1}
        className="p-2 rounded-lg hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
        const p = i + 1
        return (
          <button key={p} onClick={() => onChange(p)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-150 ${p === page ? 'bg-brand-500 text-white' : 'hover:bg-muted text-text-secondary'}`}>
            {p}
          </button>
        )
      })}
      <button onClick={() => onChange(page + 1)} disabled={page >= totalPages}
        className="p-2 rounded-lg hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
