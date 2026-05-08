import { getInitials } from '../../utils/formatters'

export default function Avatar({ name = '', src, size = 40, online = false }) {
  const initials = getInitials(name)
  const colors = ['#FF385C','#2E86AB','#52B788','#E94560','#F39C12','#9B59B6']
  const color = colors[name.charCodeAt(0) % colors.length] || '#FF385C'

  return (
    <div className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      {src
        ? <img src={src} alt={name} className="w-full h-full rounded-full object-cover" />
        : (
          <div className="w-full h-full rounded-full flex items-center justify-center text-white font-semibold"
               style={{ background: color, fontSize: size * 0.38 }}>
            {initials}
          </div>
        )
      }
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
      )}
    </div>
  )
}
