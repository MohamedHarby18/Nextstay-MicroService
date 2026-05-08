export function SkeletonCard() {
  return (
    <div className="card p-4 space-y-3">
      <div className="skeleton h-48 w-full rounded-xl" />
      <div className="skeleton h-4 w-3/4 rounded-lg" />
      <div className="skeleton h-4 w-1/2 rounded-lg" />
      <div className="skeleton h-4 w-1/3 rounded-lg" />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="px-4 py-4"><div className="skeleton h-4 w-full rounded-lg" /></td>
      ))}
    </tr>
  )
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`skeleton h-4 rounded-lg ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  )
}

export function SkeletonKpi() {
  return (
    <div className="card p-6 space-y-3">
      <div className="skeleton h-10 w-10 rounded-xl" />
      <div className="skeleton h-8 w-1/2 rounded-lg" />
      <div className="skeleton h-4 w-3/4 rounded-lg" />
    </div>
  )
}
