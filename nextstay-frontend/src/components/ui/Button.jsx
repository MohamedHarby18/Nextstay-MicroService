import { clsx } from 'clsx'

export default function Button({ children, variant = 'primary', size = 'md', className, loading, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary:   'bg-brand-500 text-white hover:bg-brand-600 rounded-xl',
    secondary: 'bg-white text-text-primary border border-border hover:bg-muted rounded-xl',
    ghost:     'text-text-primary hover:bg-muted rounded-xl',
    danger:    'bg-red-500 text-white hover:bg-red-600 rounded-xl',
    outline:   'border border-brand-500 text-brand-500 hover:bg-brand-50 rounded-xl',
  }
  const sizes = {
    sm:  'px-4 py-2 text-sm',
    md:  'px-6 py-3 text-sm',
    lg:  'px-8 py-4 text-base',
    icon:'p-2.5',
  }
  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} disabled={loading || props.disabled} {...props}>
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      )}
      {children}
    </button>
  )
}
