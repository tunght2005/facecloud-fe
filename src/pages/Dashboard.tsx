import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useApp } from '~/contexts/app.context'
import PATHS from '~/constants/paths'
import { FiBell, FiCamera, FiSettings, FiUser, FiClock, FiCheckCircle, FiFileText, FiUserCheck, FiLogOut } from 'react-icons/fi'
import userApi from '~/apis/user.api'
import { toAbsoluteMediaUrl } from '~/utils/media'

const formatDate = (val: string | null | undefined) => {
  if (!val) return '—'
  const d = new Date(val)
  if (isNaN(d.getTime())) return val
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const formatTime = (val: string | null | undefined) => {
  if (!val) return '—'
  const d = new Date(val)
  if (isNaN(d.getTime())) return val
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

export default function Dashboard() {
  const { user, roles, clearAuth } = useApp()
  const isStudent = roles.includes('student')

  const { data: attendanceData } = useQuery({
    queryKey: ['my-attendance'],
    queryFn: () => userApi.getMyAttendance(),
    enabled: isStudent
  })

  const records = Array.isArray(attendanceData?.data?.records) ? attendanceData.data.records : []

  const handleLogout = () => {
    clearAuth()
  }

  return (
    <div className='min-h-screen bg-pink-50'>
      {/* Header */}
      <header className='sticky top-0 z-10 border-b border-pink-200 bg-white/80 px-6 py-4 backdrop-blur-md'>
        <div className='mx-auto flex max-w-6xl items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 text-lg font-bold text-white shadow-md shadow-pink-200'>
              F
            </div>
            <h1 className='text-xl font-bold text-slate-900'>FaceCloud</h1>
          </div>
          <div className='flex items-center gap-4'>
            <Link
              to={PATHS.NOTIFICATIONS}
              className='flex items-center gap-2 rounded-2xl border border-pink-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-pink-50'
            >
              <FiBell /> <span className='hidden sm:inline'>Thông báo</span>
            </Link>
            <Link
              to={PATHS.PROFILE}
              className='flex items-center gap-2 rounded-2xl border border-pink-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-pink-50'
            >
              <FiUser /> <span className='hidden sm:inline'>Hồ sơ</span>
            </Link>
            <button
              onClick={handleLogout}
              className='flex items-center gap-2 rounded-2xl bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-400'
            >
              <FiLogOut /> <span className='hidden sm:inline'>Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='mx-auto max-w-6xl px-6 py-8'>
        {/* Welcome Card */}
        <div className='rounded-3xl border border-pink-200 bg-gradient-to-br from-pink-500 to-pink-600 p-8 text-white shadow-xl shadow-pink-200/50'>
          <h2 className='text-3xl font-bold'>Xin chào, {user?.full_name || 'Người dùng'}!</h2>
          <p className='mt-2 flex items-center gap-2 text-pink-100'>
            <span className='rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold uppercase'>{roles.join(', ')}</span>
            <span>• Mã: {user?.user_code || 'N/A'}</span>
          </p>
        </div>

        {/* Action Cards */}
        <div className='mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Card: Điểm danh */}
          {isStudent && (
            <Link
              to={PATHS.FACE_SCAN}
              className='group rounded-3xl border border-pink-200 bg-white p-6 shadow-sm transition hover:shadow-lg hover:shadow-pink-100/50'
            >
              <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-2xl text-pink-600 transition group-hover:bg-pink-200 group-hover:scale-110 duration-300'>
                <FiCamera />
              </div>
              <h3 className='text-lg font-bold text-slate-900'>Điểm danh</h3>
              <p className='mt-2 text-sm text-slate-500'>Quét khuôn mặt để điểm danh tự động.</p>
            </Link>
          )}

          {/* Card: Đăng ký khuôn mặt */}
          <Link
            to={PATHS.FACE_REGISTER}
            className='group rounded-3xl border border-pink-200 bg-white p-6 shadow-sm transition hover:shadow-lg hover:shadow-pink-100/50'
          >
            <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-2xl text-pink-600 transition group-hover:bg-pink-200 group-hover:scale-110 duration-300'>
              <FiUserCheck />
            </div>
            <h3 className='text-lg font-bold text-slate-900'>Đăng ký khuôn mặt</h3>
            <p className='mt-2 text-sm text-slate-500'>Đăng ký hoặc cập nhật khuôn mặt.</p>
          </Link>

          {/* Card: Hồ sơ */}
          <Link
            to={PATHS.PROFILE}
            className='group rounded-3xl border border-pink-200 bg-white p-6 shadow-sm transition hover:shadow-lg hover:shadow-pink-100/50'
          >
            <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-2xl text-pink-600 transition group-hover:bg-pink-200 group-hover:scale-110 duration-300'>
              <FiFileText />
            </div>
            <h3 className='text-lg font-bold text-slate-900'>Hồ sơ cá nhân</h3>
            <p className='mt-2 text-sm text-slate-500'>Xem và quản lý thông tin cá nhân.</p>
          </Link>

          {/* Card: Quản trị (Admin only) */}
          {(roles.includes('admin') || roles.includes('teacher')) && (
            <Link
              to={PATHS.ADMIN}
              className='group rounded-3xl border border-pink-200 bg-white p-6 shadow-sm transition hover:shadow-lg hover:shadow-pink-100/50'
            >
              <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-2xl text-pink-600 transition group-hover:bg-pink-200 group-hover:scale-110 duration-300'>
                <FiSettings />
              </div>
              <h3 className='text-lg font-bold text-slate-900'>Quản trị hệ thống</h3>
              <p className='mt-2 text-sm text-slate-500'>
                Quản lý lớp học, học sinh và buổi điểm danh.
              </p>
            </Link>
          )}
        </div>

        {/* Student Attendance History */}
        {isStudent && (
          <div className='mt-10'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-pink-500'>
                <FiClock className='text-xl' />
              </div>
              <h2 className='text-xl font-bold text-slate-900'>Lịch sử điểm danh gần đây</h2>
            </div>

            {records.length === 0 ? (
              <div className='rounded-3xl border border-dashed border-pink-200 bg-white p-12 text-center text-sm text-slate-400'>
                Bạn chưa có lịch sử điểm danh nào.
              </div>
            ) : (
              <div className='grid gap-4 md:grid-cols-2'>
                {records.map((r: any) => (
                  <div
                    key={r.attendance_id}
                    className='rounded-3xl border border-pink-100 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-pink-300 group'
                  >
                    <div className='flex items-start gap-4'>
                      {/* Image */}
                      <div className='h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-pink-100 bg-slate-50 shadow-inner'>
                        {r.captured_image_url ? (
                          <img
                            src={toAbsoluteMediaUrl(r.captured_image_url) || ''}
                            alt='Ảnh điểm danh'
                            className='h-full w-full object-cover transition duration-500 group-hover:scale-110'
                          />
                        ) : (
                          <div className='flex h-full w-full items-center justify-center text-slate-200'>
                            <FiCamera size={32} />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className='min-w-0 flex-1'>
                        <div className='flex items-center gap-2'>
                          <FiCheckCircle className='shrink-0 text-green-500' />
                          <span className='text-sm font-bold text-green-700 uppercase tracking-tight'>Có mặt</span>
                        </div>
                        <h4 className='mt-1 truncate text-base font-bold text-slate-900'>
                          {r.class_name || `Lớp #${r.class_id}`}
                        </h4>
                        <div className='mt-2 space-y-1 text-xs text-slate-500'>
                          <p className='flex items-center gap-1.5'><FiClock className='text-pink-400' /> {formatDate(r.session_date)} — {formatTime(r.check_in_time)}</p>
                          {r.similarity_score && (
                            <p className='font-semibold text-emerald-600 bg-emerald-50 inline-block px-2 py-0.5 rounded-lg'>
                              Khớp: {Number(r.similarity_score).toFixed(1)}%
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
