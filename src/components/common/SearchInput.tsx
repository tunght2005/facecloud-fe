import { FiSearch } from 'react-icons/fi'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  className = '',
  autoFocus = false
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <FiSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
      <input
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        className='w-full rounded-2xl border border-pink-100 bg-white py-2.5 pl-11 pr-4 text-sm outline-none focus:border-pink-400 transition shadow-sm'
      />
    </div>
  )
}
