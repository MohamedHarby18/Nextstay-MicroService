import { clsx } from 'clsx'

export function FormInput({ label, error, className, required, ...props }) {
  return (
    <div className={className}>
      {label && <label className="label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <input className={clsx('input', error && 'input-error')} {...props} />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export function FormTextarea({ label, error, className, rows = 4, required, ...props }) {
  return (
    <div className={className}>
      {label && <label className="label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <textarea rows={rows} className={clsx('input resize-none', error && 'input-error')} {...props} />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export function FormSelect({ label, error, className, children, required, ...props }) {
  return (
    <div className={className}>
      {label && <label className="label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <select className={clsx('input', error && 'input-error')} {...props}>
        {children}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
