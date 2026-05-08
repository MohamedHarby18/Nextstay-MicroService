import { useState } from 'react'
import { clsx } from 'clsx'

export default function Tabs({ tabs, defaultTab, onChange, className }) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id)

  const handleChange = (id) => {
    setActive(id)
    onChange?.(id)
  }

  return (
    <div className={clsx('flex gap-1 p-1 bg-muted rounded-xl', className)}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => handleChange(tab.id)}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            active === tab.id
              ? 'bg-white text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          {tab.icon && <tab.icon size={15} />}
          {tab.label}
          {tab.count != null && (
            <span className={clsx(
              'text-xs px-1.5 py-0.5 rounded-full font-semibold',
              active === tab.id ? 'bg-brand-500 text-white' : 'bg-gray-200 text-text-secondary'
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
