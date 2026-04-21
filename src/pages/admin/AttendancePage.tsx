import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useState } from 'react'
import attendanceApi from '~/apis/attendance.api'
import PATHS from '~/constants/paths'
import { FiTrash2, FiPlay, FiSquare, FiList } from 'react-icons/fi'
import Pagination from '~/components/common/Pagination'
import SearchInput from '~/components/common/SearchInput'
import FilterSelect from '~/components/common/FilterSelect'

const formatDate = (val: string | null | undefined) => {
  if (!val) return '—'
  const d = new Date(val)
  if (isNaN(d.getTime())) return String(val).split('T')[0] || val
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const formatTime = (val: string | null | undefined) => {
  if (!val) return '—'
  const d = new Date(val)
  if (isNaN(d.getTime())) return val
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

export default function AttendancePage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const limit = 5

  const { data, isLoading } = useQuery({
    queryKey: ['attendance-sessions', searchTerm, statusFilter, page],
    queryFn: () => attendanceApi.getSessionList({ q: searchTerm, status: statusFilter, page, limit })
  })

  const sessions = (Array.isArray(data?.data?.sessions) ? data.data.sessions : []) as any[]
  const pagination = data?.data?.pagination

  const openMutation = useMutation({
    mutationFn: attendanceApi.openSession,
    onSuccess: () => {
      toast.success('Đã mở buổi điểm danh!')
      queryClient.invalidateQueries({ queryKey: ['attendance-sessions'] })
    }
  })

  const closeMutation = useMutation({
    mutationFn: attendanceApi.closeSession,
    onSuccess: () => {
      toast.success('Đã đóng buổi điểm danh!')
      queryClient.invalidateQueries({ queryKey: ['attendance-sessions'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: attendanceApi.deleteSession,
    onSuccess: () => {
      toast.success('Đã xoá buổi điểm danh!')
      queryClient.invalidateQueries({ queryKey: ['attendance-sessions'] })
    }
  })

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc muốn xoá buổi điểm danh này?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-slate-900'>Quản lý Buổi điểm danh</h2>
          <p className='mt-1 text-sm text-slate-500'>Tạo và quản lý các buổi điểm danh bằng khuôn mặt.</p>
        </div>
        <Link
          to={PATHS.ADMIN_ATTENDANCE_CREATE}
          className='rounded-2xl bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-400 shadow-lg shadow-pink-200'
        >
          + Tạo buổi mới
        </Link>
      </div>

      {/* Filters */}
      <div className='mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <SearchInput
          placeholder='Tìm theo tên lớp...'
          value={searchTerm}
          onChange={(val) => { setSearchTerm(val); setPage(1); }}
        />
        <FilterSelect
          placeholder='Tất cả trạng thái'
          value={statusFilter}
          onChange={(val) => { setStatusFilter(val); setPage(1); }}
          options={[
            { label: 'Đang kế hoạch', value: 'planning' },
            { label: 'Đang mở', value: 'open' },
            { label: 'Đã đóng', value: 'closed' }
          ]}
        />
        <div className='flex items-center rounded-2xl border border-pink-100 bg-pink-50/50 px-4 py-2.5 text-sm text-slate-600 font-medium'>
          Tổng: <span className='ml-1 font-bold text-pink-600'>{pagination?.total || 0}</span> buổi
        </div>
      </div>

      {isLoading ? (
        <div className='py-20 text-center text-slate-400'>Đang tải...</div>
      ) : (
        <>
          <div className='overflow-x-auto rounded-3xl border border-pink-100 bg-white shadow-sm'>
            <table className='w-full text-sm text-left'>
              <thead>
                <tr className='border-b border-pink-50 bg-pink-50/30 text-[10px] font-black uppercase tracking-widest text-pink-600'>
                  <th className='px-6 py-4'>ID</th>
                  <th className='px-6 py-4'>Lớp học</th>
                  <th className='px-6 py-4'>Ngày / Giờ</th>
                  <th className='px-6 py-4 text-center'>Trạng thái</th>
                  <th className='px-6 py-4 text-right'>Thao tác</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-pink-50'>
                {sessions.map((s) => (
                  <tr key={s.attendance_session_id} className='transition hover:bg-pink-50/20'>
                    <td className='px-6 py-4 font-medium text-slate-500'>{s.attendance_session_id}</td>
                    <td className='px-6 py-4 font-bold text-slate-900'>{s.class_name}</td>
                    <td className='px-6 py-4 text-slate-600'>
                      <p className='font-bold'>{formatDate(s.session_date)}</p>
                      <p className='text-[11px] font-medium text-slate-400'>
                        {formatTime(s.start_time)} – {formatTime(s.end_time)}
                      </p>
                    </td>
                    <td className='px-6 py-4 text-center'>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                          s.status === 'open'
                            ? 'bg-green-100 text-green-600'
                            : s.status === 'closed'
                              ? 'bg-slate-100 text-slate-500'
                              : 'bg-amber-100 text-amber-600'
                        }`}
                      >
                        {s.status === 'open' ? 'Đang mở' : s.status === 'closed' ? 'Đã đóng' : 'Kế hoạch'}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <div className='flex justify-end gap-2'>
                        {s.status === 'planning' && (
                          <button
                            onClick={() => openMutation.mutate({ attendance_session_id: s.attendance_session_id })}
                            disabled={openMutation.isPending}
                            className='rounded-xl bg-pink-500 p-2 text-white shadow-sm transition hover:bg-pink-400'
                            title='Mở buổi điểm danh'
                          >
                            <FiPlay />
                          </button>
                        )}
                        {s.status === 'open' && (
                          <button
                            onClick={() => closeMutation.mutate({ attendance_session_id: s.attendance_session_id })}
                            disabled={closeMutation.isPending}
                            className='rounded-xl bg-slate-800 p-2 text-white shadow-sm transition hover:bg-slate-700'
                            title='Đóng buổi điểm danh'
                          >
                            <FiSquare />
                          </button>
                        )}
                        <Link
                          to={`${PATHS.ADMIN_ATTENDANCE_LOGS}?session=${s.attendance_session_id}&class=${s.class_id}`}
                          className='rounded-xl border border-pink-100 p-2 text-pink-400 transition hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200'
                          title='Xem Logs'
                        >
                          <FiList size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(s.attendance_session_id)}
                          className='rounded-xl border border-rose-100 p-2 text-rose-400 transition hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                          title='Xoá'
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sessions.length === 0 && (
                  <tr>
                    <td colSpan={5} className='py-20 text-center text-slate-400 font-medium'>
                      Không tìm thấy buổi điểm danh nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            total_pages={pagination?.total_pages || 0}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}
