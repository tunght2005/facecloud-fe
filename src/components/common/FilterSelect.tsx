import { FiFilter } from 'react-icons/fi'

interface FilterSelectProps {
  value: string
  onChange: (value: string) => void
  options: { label: string; value: string }[]
  placeholder?: string
  className?: string
}

export default function FilterSelect({ value, onChange, options, placeholder = 'Tất cả', className = '' }: FilterSelectProps) {
  return (
    <div className={`relative ${className}`}>
      <FiFilter className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full appearance-none rounded-2xl border border-pink-100 bg-white py-2.5 pl-11 pr-10 text-sm outline-none focus:border-pink-400 transition shadow-sm'
      >
        <option value=''>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
