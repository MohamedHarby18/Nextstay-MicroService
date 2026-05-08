import { Search, X } from 'lucide-react'
import { useState } from 'react'

export default function SearchBar({ placeholder = 'Search...', onSearch, value: controlledValue, className }) {
  const [val, setVal] = useState(controlledValue || '')

  const handleChange = (e) => {
    setVal(e.target.value)
    onSearch?.(e.target.value)
  }
  const clear = () => { setVal(''); onSearch?.('') }

  return (
    <div className={`relative ${className}`}>
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
      <input
        type="text"
        value={val}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-muted border border-transparent rounded-xl text-sm text-text-primary
                   placeholder:text-text-light focus:outline-none focus:border-brand-500 focus:bg-white transition-all duration-200"
      />
      {val && (
        <button onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text-secondary transition-colors">
          <X size={14} />
        </button>
      )}
    </div>
  )
}
