import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { clsx } from 'clsx'

export default function KpiCard({ title, value, subtitle, icon: Icon, trend, trendValue, accentColor = '#FF385C' }) {
  const trendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-gray-400'
  const TrendIcon = trendIcon

  return (
    <div className="card p-6 hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
             style={{ background: `${accentColor}18` }}>
          {Icon && <Icon size={22} style={{ color: accentColor }} />}
        </div>
        {trend && (
          <div className={clsx('flex items-center gap-1 text-xs font-semibold', trendColor)}>
            <TrendIcon size={14} />
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-text-primary mb-1">{value}</div>
      <div className="text-sm font-semibold text-text-primary">{title}</div>
      {subtitle && <div className="text-xs text-text-secondary mt-0.5">{subtitle}</div>}
    </div>
  )
}
