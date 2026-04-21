import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { User } from '../types'
import PATHS from '../constants/paths'

type DashboardProps = {
  user: User
  onLogout: () => void
}

type AttendanceRecord = {
  date: string
  time: string
  status: 'present' | 'absent' | 'late'
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([])

  useEffect(() => {
    // Mock data for attendance history
    if (user.role === 'student') {
      setAttendanceHistory([
        { date: '2024-04-20', time: '08:00', status: 'present' },
        { date: '2024-04-19', time: '08:05', status: 'late' },
        { date: '2024-04-18', time: '08:00', status: 'present' },
        { date: '2024-04-17', time: '08:00', status: 'present' },
        { date: '2024-04-16', time: '08:10', status: 'late' },
      ])
    }
  }, [user.role])

  return (
    <div className="min-h-screen bg-pink-50 text-slate-900 p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-xl shadow-pink-200/50 border border-pink-100">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-pink-600">FaceCloud School</p>
              <h1 className="mt-3 text-3xl font-bold">Xin chào, {user.name}!</h1>
              <p className="mt-2 text-slate-600">
                {user.role === 'student' ? 'Điểm danh học sinh' : 'Quản lý lớp phụ trách'}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center justify-center rounded-2xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-500"
            >
              Đăng xuất
            </button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-lg shadow-pink-100 border border-pink-100">
              <div className="flex items-center gap-4">
                <img src={user.avatarUrl} alt="avatar" className="h-16 w-16 rounded-2xl border border-pink-200 object-cover" />
                <div>
                  <p className="text-lg font-semibold">{user.name}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                  <p className="mt-1 rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-pink-700">
                    {user.role === 'student' ? 'Học sinh' : 'Giáo viên'}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-pink-100 bg-pink-50 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Mã</p>
                  <p className="mt-2 text-lg font-semibold">{user.id}</p>
                </div>
                <div className="rounded-3xl border border-pink-100 bg-pink-50 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Thông tin chính</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {user.role === 'student' ? user.className ?? 'Chưa cập nhật' : user.subject ?? 'Chưa cập nhật'}
                  </p>
                </div>
                <div className="rounded-3xl border border-pink-100 bg-pink-50 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Phụ trách</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {user.role === 'student' ? user.supervisor ?? 'Chưa cập nhật' : user.homeRoom ?? 'Chưa cập nhật'}
                  </p>
                </div>
              </div>
            </div>

            {user.role === 'student' && (
              <div className="rounded-3xl bg-white p-6 shadow-lg shadow-pink-100 border border-pink-100">
                <h2 className="text-xl font-semibold">Lịch sử điểm danh</h2>
                <div className="mt-4 space-y-3">
                  {attendanceHistory.length > 0 ? (
                    attendanceHistory.map((record, index) => (
                      <div key={index} className="flex items-center justify-between rounded-2xl border border-pink-100 bg-pink-50 p-4">
                        <div>
                          <p className="font-semibold">{record.date}</p>
                          <p className="text-sm text-slate-600">{record.time}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                          record.status === 'present' ? 'bg-green-100 text-green-700' :
                          record.status === 'late' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {record.status === 'present' ? 'Có mặt' : record.status === 'late' ? 'Muộn' : 'Vắng'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-600">Chưa có dữ liệu điểm danh.</p>
                  )}
                </div>
              </div>
            )}

            <div className="rounded-3xl bg-white p-6 shadow-lg shadow-pink-100 border border-pink-100">
              <h2 className="text-xl font-semibold">Hướng dẫn sử dụng</h2>
              <ul className="mt-4 space-y-3 text-slate-600">
                <li>• Sinh viên sử dụng trang điểm danh khuôn mặt để quét khuôn mặt.</li>
                <li>• Giáo viên phụ trách lớp sẽ kiểm tra danh sách học sinh.</li>
                <li>• Tài khoản chỉ có thể được cấp bởi admin nên không có đăng ký tự do.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-br from-pink-500 to-rose-500 p-6 text-white shadow-xl shadow-pink-200/30">
              <p className="text-sm uppercase tracking-[0.35em] text-pink-100/80">Nhanh chóng</p>
              <h2 className="mt-4 text-2xl font-bold">Bắt đầu</h2>
              <p className="mt-3 text-pink-100/90">Chọn chức năng phù hợp để vào trang tương ứng.</p>
              <div className="mt-6 flex flex-col gap-3">
                {user.role === 'student' ? (
                  <Link to={PATHS.FACE_SCAN} className="rounded-2xl bg-white px-5 py-3 text-center font-semibold text-pink-700 transition hover:bg-pink-50">
                    Mở trang điểm danh
                  </Link>
                ) : (
                  <div className="rounded-3xl bg-white/10 p-4 text-pink-100">
                    <p>Giáo viên có thể xem thông tin lớp và học sinh quản lý.</p>
                  </div>
                )}
                <Link to={PATHS.PROFILE} className="rounded-2xl border border-white/60 bg-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/20">
                  Xem hồ sơ
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg shadow-pink-100 border border-pink-100">
              <h2 className="text-lg font-semibold">Thông báo admin</h2>
              <p className="mt-3 text-slate-600">Tài khoản được quản lý bởi admin. Nếu cần cấp quyền mới, hãy liên hệ bộ phận CNTT hoặc quản trị hệ thống.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
