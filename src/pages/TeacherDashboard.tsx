import { Link } from 'react-router-dom'
import type { User } from '../types'
import PATHS from '../constants/paths'

type TeacherDashboardProps = {
  user: User
  onLogout: () => void
}

const sampleClasses = [
  { name: '12A1', students: 32, subject: 'Công nghệ thông tin' },
  { name: '11A3', students: 28, subject: 'Toán tin' },
]

const sampleStudents = [
  { id: 'SV2026010', name: 'Trần Minh Khang', className: '12A1' },
  { id: 'SV2026020', name: 'Lê Thị Hồng', className: '12A1' },
  { id: 'SV2026030', name: 'Nguyễn An', className: '11A3' },
]

export default function TeacherDashboard({ user, onLogout }: TeacherDashboardProps) {
  return (
    <div className="min-h-screen bg-pink-50 text-slate-900 p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-3xl bg-white p-6 shadow-xl shadow-pink-200/40 border border-pink-100">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-pink-600">FaceCloud School</p>
              <h1 className="mt-3 text-3xl font-bold">Xin chào, {user.name}</h1>
              <p className="mt-2 text-slate-600">Giáo viên phụ trách lớp: {user.homeRoom ?? 'Chưa cập nhật'}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to={PATHS.PROFILE} className="rounded-2xl border border-pink-200 bg-white px-5 py-3 text-sm font-semibold text-pink-700 transition hover:bg-pink-50">
                Xem hồ sơ
              </Link>
              <button
                onClick={onLogout}
                className="rounded-2xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-500"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-3xl bg-white p-6 shadow-lg shadow-pink-100 border border-pink-100">
            <h2 className="text-xl font-semibold text-slate-900">Lớp do bạn quản lý</h2>
            <div className="mt-5 grid gap-4">
              {sampleClasses.map((item) => (
                <div key={item.name} className="rounded-3xl border border-pink-100 bg-pink-50 p-4">
                  <p className="text-sm uppercase tracking-[0.25em] text-pink-600">{item.name}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{item.subject}</p>
                  <p className="mt-1 text-sm text-slate-600">Số học sinh: {item.students}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-lg shadow-pink-100 border border-pink-100">
            <h2 className="text-xl font-semibold text-slate-900">Tổng quan</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-3xl bg-pink-50 p-4">
                <p className="text-sm uppercase tracking-[0.25em] text-pink-600">Bộ môn</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{user.subject ?? 'Chưa cập nhật'}</p>
              </div>
              <div className="rounded-3xl bg-pink-50 p-4">
                <p className="text-sm uppercase tracking-[0.25em] text-pink-600">Số lớp phụ trách</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{sampleClasses.length}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="rounded-3xl bg-white p-6 shadow-lg shadow-pink-100 border border-pink-100">
          <h2 className="text-xl font-semibold text-slate-900">Danh sách học sinh</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full divide-y divide-pink-100 text-left text-sm text-slate-700">
              <thead className="border-b border-pink-100 bg-pink-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-pink-600">Mã SV</th>
                  <th className="px-4 py-3 font-semibold text-pink-600">Họ tên</th>
                  <th className="px-4 py-3 font-semibold text-pink-600">Lớp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-100">
                {sampleStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-pink-50">
                    <td className="px-4 py-3">{student.id}</td>
                    <td className="px-4 py-3">{student.name}</td>
                    <td className="px-4 py-3">{student.className}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
