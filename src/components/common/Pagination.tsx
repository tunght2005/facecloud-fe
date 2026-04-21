import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface PaginationProps {
  page: number
  total_pages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, total_pages, onPageChange }: PaginationProps) {
  if (total_pages <= 1) return null

  return (
    <div className='mt-8 flex items-center justify-center gap-2'>
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className='flex h-10 w-10 items-center justify-center rounded-xl border border-pink-200 bg-white text-slate-600 transition hover:bg-pink-50 disabled:opacity-40'
      >
        <FiChevronLeft />
      </button>
      
      <div className='flex items-center gap-1'>
        {[...Array(total_pages)].map((_, i) => {
          const p = i + 1
          // Simple logic to show current, first, last and dots if many pages
          // For now, just show all since we don't expect 100+ pages in a demo
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`h-10 w-10 rounded-xl text-sm font-bold transition ${
                page === p
                  ? 'bg-pink-500 text-white shadow-md shadow-pink-200'
                  : 'bg-white border border-pink-100 text-slate-600 hover:bg-pink-50'
              }`}
            >
              {p}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => onPageChange(Math.min(total_pages, page + 1))}
        disabled={page === total_pages}
        className='flex h-10 w-10 items-center justify-center rounded-xl border border-pink-200 bg-white text-slate-600 transition hover:bg-pink-50 disabled:opacity-40'
      >
        <FiChevronRight />
      </button>
    </div>
  )
}
