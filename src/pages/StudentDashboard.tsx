import { Link } from 'react-router-dom'
import type { User } from '../types'
import PATHS from '../constants/paths'

type StudentDashboardProps = {
  user: User
  onLogout: () => void
}

export default function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  return (
    <div className="min-h-screen bg-pink-50 text-slate-900 p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-3xl bg-white p-6 shadow-xl shadow-pink-200/40 border border-pink-100">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-pink-600">FaceCloud School</p>
              <h1 className="mt-3 text-3xl font-bold">Xin chào, {user.name}</h1>
              <p className="mt-2 text-slate-600">Lớp: {user.className ?? 'Chưa cập nhật'}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to={PATHS.FACE_SCAN} className="rounded-2xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-500">
                Mở trang điểm danh
              </Link>
              <button
                onClick={onLogout}
                className="rounded-2xl border border-pink-200 bg-white px-5 py-3 text-sm font-semibold text-pink-700 transition hover:bg-pink-50"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl bg-white p-6 shadow-lg shadow-pink-100 border border-pink-100">
            <h2 className="text-xl font-semibold text-slate-900">Thông tin học sinh</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-pink-100 bg-pink-50 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Mã sinh viên</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{user.id}</p>
              </div>
              <div className="rounded-3xl border border-pink-100 bg-pink-50 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Lớp</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{user.className ?? 'Chưa cập nhật'}</p>
              </div>
              <div className="rounded-3xl border border-pink-100 bg-pink-50 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Email</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{user.email}</p>
              </div>
              <div className="rounded-3xl border border-pink-100 bg-pink-50 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Vai trò</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Học sinh</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-lg shadow-pink-100 border border-pink-100">
              <h2 className="text-lg font-semibold text-slate-900">Hướng dẫn</h2>
              <p className="mt-3 text-slate-600">Nhấn "Mở trang điểm danh" để vào màn hình camera. Mỗi lần quét sẽ gửi ảnh lên hệ thống để điểm danh.</p>
            </div>
            <div className="rounded-3xl bg-pink-50 p-6 border border-pink-100">
              <h2 className="text-lg font-semibold text-slate-900">Lưu ý lớp</h2>
              <p className="mt-3 text-slate-600">Đảm bảo mặt không bị che, ánh sáng đủ để camera nhận diện chính xác.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
