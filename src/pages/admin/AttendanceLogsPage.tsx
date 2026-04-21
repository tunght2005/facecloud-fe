import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import attendanceApi from '~/apis/attendance.api'
import classApi from '~/apis/class.api'
import { toAbsoluteMediaUrl } from '~/utils/media'
import { FiX, FiUser, FiHash, FiCamera, FiClock, FiCheck, FiTrash2 } from 'react-icons/fi'
import Pagination from '~/components/common/Pagination'
import SearchInput from '~/components/common/SearchInput'

type SimpleStudent = {
  user_id: number
  full_name: string
  user_code: string
  email?: string
}

type SimpleRecord = {
  attendance_id: number
  user_id: number
  full_name: string
  user_code: string
  email?: string
  check_in_time: string
  attendance_status?: string
  captured_image_url?: string | null
}

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
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export default function AttendanceLogsPage() {
  const queryClient = useQueryClient()
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null)
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<SimpleRecord | null>(null)

  const [presentSearch, setPresentSearch] = useState('')
  const [absentSearch, setAbsentSearch] = useState('')

  const { data: classesRes } = useQuery({
    queryKey: ['classes-for-logs'],
    queryFn: () => classApi.getAll({ limit: 100 })
  })

  const classes = Array.isArray(classesRes?.data?.data) ? classesRes.data.data : []

  const { data: sessionsRes } = useQuery({
    queryKey: ['sessions-for-logs', selectedClassId],
    enabled: Boolean(selectedClassId),
    queryFn: () => attendanceApi.getSessionList(selectedClassId ? { class_id: selectedClassId, limit: 100 } : undefined)
  })

  const sessions = Array.isArray(sessionsRes?.data?.sessions) ? sessionsRes.data.sessions : []

  const { data: classStudentsRes } = useQuery({
    queryKey: ['class-students-for-logs', selectedClassId],
    enabled: Boolean(selectedClassId),
    queryFn: () => classApi.getStudents(selectedClassId as number)
  })

  const classStudents = (
    Array.isArray(classStudentsRes?.data?.data) ? classStudentsRes.data.data : []
  ) as SimpleStudent[]

  const { data: sessionDetailsRes } = useQuery({
    queryKey: ['session-details-for-logs', selectedSessionId],
    enabled: Boolean(selectedSessionId),
    queryFn: () => attendanceApi.getSessionDetails(selectedSessionId as number)
  })

  const session = sessionDetailsRes?.data?.session
  const presentRecords = (
    Array.isArray(sessionDetailsRes?.data?.records) ? sessionDetailsRes.data.records : []
  ) as SimpleRecord[]

  const filteredPresent = useMemo(() => {
    if (!presentSearch.trim()) return presentRecords
    const q = presentSearch.toLowerCase()
    return presentRecords.filter(r => 
      r.full_name.toLowerCase().includes(q) || 
      r.user_code.toLowerCase().includes(q) || 
      r.email?.toLowerCase().includes(q)
    )
  }, [presentRecords, presentSearch])

  const absentStudents = useMemo(() => {
    const presentSet = new Set(presentRecords.map((r) => r.user_id))
    const list = classStudents.filter((s) => !presentSet.has(s.user_id))
    if (!absentSearch.trim()) return list
    const q = absentSearch.toLowerCase()
    return list.filter(s => 
      s.full_name.toLowerCase().includes(q) || 
      s.user_code.toLowerCase().includes(q) || 
      s.email?.toLowerCase().includes(q)
    )
  }, [classStudents, presentRecords, absentSearch])

  const manualMutation = useMutation({
    mutationFn: attendanceApi.manualAttendance,
    onSuccess: () => {
      toast.success('Đã đánh dấu điểm danh thành công!')
      queryClient.invalidateQueries({ queryKey: ['session-details-for-logs', selectedSessionId] })
    }
  })

  const deleteRecordMutation = useMutation({
    mutationFn: attendanceApi.deleteRecord,
    onSuccess: () => {
      toast.success('Đã xoá bản ghi điểm danh!')
      queryClient.invalidateQueries({ queryKey: ['session-details-for-logs', selectedSessionId] })
    }
  })

  const handleManualMark = (studentId: number) => {
    if (!selectedSessionId) return
    manualMutation.mutate({ attendance_session_id: selectedSessionId, user_id: studentId })
  }

  const handleDeleteRecord = (id: number) => {
    if (confirm('Bạn có chắc muốn xoá bản ghi điểm danh này?')) {
      deleteRecordMutation.mutate(id)
    }
  }

  return (
    <div className='space-y-6 pb-20'>
      <div>
        <h2 className='text-2xl font-bold text-slate-900'>Logs điểm danh theo lớp</h2>
        <p className='mt-1 text-sm text-slate-500'>Theo dõi ai đã điểm danh và ai chưa. Click vào từng học sinh để xem chi tiết.</p>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <div>
          <label className='mb-1.5 block text-sm font-bold text-slate-700'>1. Chọn lớp học</label>
          <select
            value={selectedClassId || ''}
            onChange={(e) => {
              const value = Number(e.target.value)
              setSelectedClassId(Number.isNaN(value) ? null : value)
              setSelectedSessionId(null)
            }}
            className='w-full rounded-2xl border border-pink-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 shadow-sm transition'
          >
            <option value=''>-- Chọn lớp --</option>
            {classes.map((cls) => (
              <option key={cls.class_id} value={cls.class_id}>
                {cls.class_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='mb-1.5 block text-sm font-bold text-slate-700'>2. Chọn buổi điểm danh</label>
          <select
            value={selectedSessionId || ''}
            onChange={(e) => {
              const value = Number(e.target.value)
              setSelectedSessionId(Number.isNaN(value) ? null : value)
            }}
            disabled={!selectedClassId}
            className='w-full rounded-2xl border border-pink-200 bg-white px-4 py-3 text-slate-900 outline-none disabled:opacity-60 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 shadow-sm transition appearance-none'
          >
            <option value=''>-- Chọn buổi --</option>
            {sessions.map((s) => (
              <option key={s.attendance_session_id} value={s.attendance_session_id}>
                #{s.attendance_session_id} — {formatDate(s.session_date)} — {s.status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedSessionId && (
        <div className='grid gap-8 lg:grid-cols-2'>
          {/* List: Present */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='flex items-center gap-2 text-lg font-bold text-slate-900 uppercase tracking-tight'>
                <span className='flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs font-black'>
                  {presentRecords.length}
                </span>
                Đã điểm danh
              </h3>
            </div>
            
            <SearchInput
              placeholder='Tìm học sinh có mặt...'
              value={presentSearch}
              onChange={setPresentSearch}
            />

            <div className='space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar'>
              {filteredPresent.map((r) => {
                const isLate = session && r.check_in_time && new Date(r.check_in_time) > new Date(session.end_time)

                return (
                  <div
                    key={r.attendance_id}
                    onClick={() => setSelectedStudent(r)}
                    className={`cursor-pointer rounded-3xl border bg-white p-4 transition hover:shadow-lg ${
                      isLate ? 'border-red-200 bg-red-50/10' : 'border-pink-50'
                    }`}
                  >
                    <div className='flex items-center gap-4'>
                      {r.captured_image_url ? (
                        <div className='h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-pink-100 shadow-sm'>
                          <img
                            src={toAbsoluteMediaUrl(r.captured_image_url) || ''}
                            alt=''
                            className='h-full w-full object-cover'
                          />
                        </div>
                      ) : (
                        <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-pink-500'>
                          <FiUser />
                        </div>
                      )}
                      <div className='min-w-0 flex-1'>
                        <p className='truncate text-sm font-bold text-slate-900'>{r.full_name}</p>
                        <p className='truncate text-[10px] font-bold text-slate-400 uppercase tracking-widest'>
                          {r.user_code} • {formatTime(r.check_in_time)}
                        </p>
                      </div>
                      <div className='flex flex-col items-end gap-1'>
                        {isLate && (
                          <span className='rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-sm'>
                            TRỄ
                          </span>
                        )}
                        <span className='rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-sm'>
                          OK
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteRecord(r.attendance_id)
                        }}
                        className='ml-2 rounded-xl p-2 text-slate-300 transition hover:bg-rose-50 hover:text-rose-500'
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                )
              })}
              {filteredPresent.length === 0 && (
                <div className='py-20 text-center text-sm text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl font-medium'>
                  {presentSearch ? 'Không tìm thấy kết quả' : 'Chưa có ai điểm danh'}
                </div>
              )}
            </div>
          </div>

          {/* List: Absent */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='flex items-center gap-2 text-lg font-bold text-slate-900 uppercase tracking-tight'>
                <span className='flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-black'>
                  {absentStudents.length}
                </span>
                Vắng mặt
              </h3>
            </div>

            <SearchInput
              placeholder='Tìm học sinh vắng...'
              value={absentSearch}
              onChange={setAbsentSearch}
            />

            <div className='space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar'>
              {absentStudents.map((s) => (
                <div
                  key={s.user_id}
                  className='rounded-3xl border border-pink-50 bg-white/50 p-4 transition hover:bg-white hover:shadow-md'
                >
                  <div className='flex items-center gap-4'>
                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-300'>
                      <FiUser />
                    </div>
                    <div className='min-w-0 flex-1 opacity-60'>
                      <p className='truncate text-sm font-bold text-slate-900'>{s.full_name}</p>
                      <p className='truncate text-[10px] font-bold text-slate-400 uppercase tracking-widest'>{s.user_code}</p>
                    </div>
                    <button
                      onClick={() => handleManualMark(s.user_id)}
                      disabled={manualMutation.isPending}
                      className='rounded-2xl bg-pink-500 px-4 py-2 text-[11px] font-black uppercase text-white shadow-lg shadow-pink-100 transition hover:bg-pink-400 disabled:opacity-50'
                    >
                      Điểm danh
                    </button>
                  </div>
                </div>
              ))}
              {absentStudents.length === 0 && (
                <div className='py-20 text-center text-sm text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl font-medium'>
                  {absentSearch ? 'Không tìm thấy kết quả' : 'Tất cả đã có mặt!'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedStudent && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm'>
          <div className='relative w-full max-w-lg rounded-[40px] bg-white p-10 shadow-2xl'>
            <button
              onClick={() => setSelectedStudent(null)}
              className='absolute right-8 top-8 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600'
            >
              <FiX size={24} />
            </button>

            <h3 className='text-2xl font-black text-slate-900 uppercase tracking-tighter'>Chi tiết điểm danh</h3>
            <p className='mt-1 text-sm text-slate-500 font-medium'>Thông tin xác thực khuôn mặt từ hệ thống.</p>

            <div className='mt-10 flex flex-col items-center gap-8'>
              <div className='relative h-56 w-56 overflow-hidden rounded-[40px] border-8 border-pink-50 shadow-2xl'>
                {selectedStudent.captured_image_url ? (
                  <img
                    src={toAbsoluteMediaUrl(selectedStudent.captured_image_url) || ''}
                    alt=''
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center bg-slate-50 text-slate-300'>
                    <FiCamera size={64} />
                  </div>
                )}
                <div className='absolute bottom-5 right-5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-black uppercase text-pink-600 shadow-xl'>
                  VERIFIED
                </div>
              </div>

              <div className='w-full space-y-4'>
                <div className='flex items-center gap-4 rounded-3xl bg-pink-50/50 p-5'>
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-pink-500 shadow-sm'>
                    <FiUser size={20} />
                  </div>
                  <div className='min-w-0'>
                    <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Học sinh</p>
                    <p className='truncate font-bold text-slate-900 text-lg'>{selectedStudent.full_name}</p>
                  </div>
                </div>

                <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='flex items-center gap-4 rounded-3xl bg-slate-50 p-5'>
                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm'>
                      <FiHash size={20} />
                    </div>
                    <div className='min-w-0'>
                      <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Mã số</p>
                      <p className='truncate font-bold text-slate-900'>{selectedStudent.user_code}</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-4 rounded-3xl bg-slate-50 p-5'>
                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm'>
                      <FiClock size={20} />
                    </div>
                    <div className='min-w-0'>
                      <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Giờ quét</p>
                      <p className='truncate font-bold text-slate-900'>{formatTime(selectedStudent.check_in_time)}</p>
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-4 rounded-3xl border-4 border-emerald-50 bg-emerald-50/30 p-5'>
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-100'>
                    <FiCheck size={20} />
                  </div>
                  <div>
                    <p className='text-[10px] font-black uppercase text-emerald-600 tracking-widest'>Trạng thái</p>
                    <p className='font-black text-emerald-700 text-lg'>HỢP LỆ</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-10'>
              <button
                onClick={() => setSelectedStudent(null)}
                className='w-full rounded-[24px] bg-slate-900 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-slate-800 shadow-2xl shadow-slate-200'
              >
                Xác nhận & Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Logs Section */}
      <GlobalAuditLogs />
    </div>
  )
}

function GlobalAuditLogs() {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const limit = 5

  const { data, isLoading } = useQuery({
    queryKey: ['global-attendance-logs', searchTerm, page],
    queryFn: () => attendanceApi.getAttendanceLogs({ q: searchTerm, page, limit })
  })

  const logs = Array.isArray(data?.data?.logs) ? data.data.logs : []
  const pagination = data?.data?.pagination

  return (
    <div className='mt-12 border-t border-pink-100 pt-12'>
      <div className='mb-6'>
        <h3 className='text-xl font-bold text-slate-900 uppercase tracking-tight'>Nhật ký hệ thống</h3>
        <p className='text-sm text-slate-500 font-medium'>Toàn bộ lịch sử điểm danh thành công trên ứng dụng.</p>
      </div>

      <div className='mb-6 max-w-md'>
        <SearchInput
          placeholder='Tìm tên, mã, email...'
          value={searchTerm}
          onChange={val => { setSearchTerm(val); setPage(1); }}
        />
      </div>

      {isLoading ? (
        <div className='py-20 text-center text-slate-400 font-medium'>Đang tải nhật ký...</div>
      ) : (
        <>
          <div className='overflow-x-auto rounded-[40px] border border-pink-100 bg-white shadow-sm'>
            <table className='w-full text-sm text-left'>
              <thead>
                <tr className='border-b border-pink-50 bg-pink-50/30 text-[10px] uppercase font-black tracking-widest text-pink-600'>
                  <th className='px-8 py-5'>Thời gian</th>
                  <th className='px-8 py-5'>Học sinh</th>
                  <th className='px-8 py-5'>Lớp học</th>
                  <th className='px-8 py-5 text-center'>Ảnh quét</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-pink-50'>
                {logs.map((log: any) => (
                  <tr key={log.log_id} className='hover:bg-pink-50/10 transition'>
                    <td className='px-8 py-5 whitespace-nowrap text-[11px] text-slate-500 font-bold'>
                      <p>{formatDate(log.log_time)}</p>
                      <p className='opacity-40'>{formatTime(log.log_time)}</p>
                    </td>
                    <td className='px-8 py-5'>
                      <div className='flex items-center gap-3'>
                        <div className='h-8 w-8 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 shadow-inner'>
                          <FiUser size={14} />
                        </div>
                        <div>
                          <p className='font-bold text-slate-900'>{log.full_name}</p>
                          <p className='text-[10px] text-slate-400 font-bold uppercase tracking-tight'>{log.user_code}</p>
                        </div>
                      </div>
                    </td>
                    <td className='px-8 py-5'>
                      <p className='font-bold text-slate-700'>{log.class_name}</p>
                      <p className='text-[10px] text-pink-400 font-black uppercase tracking-widest'>#{log.attendance_session_id}</p>
                    </td>
                    <td className='px-8 py-5 text-center'>
                      {log.captured_image_url && (
                        <img 
                          src={toAbsoluteMediaUrl(log.captured_image_url) || ''} 
                          alt='' 
                          className='h-12 w-12 object-cover rounded-2xl mx-auto border-2 border-pink-50 shadow-sm'
                        />
                      )}
                    </td>
                  </tr>
                ))}
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
