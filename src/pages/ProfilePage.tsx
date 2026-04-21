import { Link } from 'react-router-dom'
import type { User } from '../types'
import PATHS from '../constants/paths'

type ProfilePageProps = {
  user: User
}

export default function ProfilePage({ user }: ProfilePageProps) {
  return (
    <div className="min-h-screen bg-pink-50 p-6 text-slate-900">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-xl shadow-pink-200/40 border border-pink-100">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-pink-600">Hồ sơ người dùng</p>
              <h1 className="mt-4 text-3xl font-bold text-slate-900">Thông tin tài khoản</h1>
              <p className="mt-3 text-slate-600">Mọi tài khoản đều do admin cấp, không có đăng ký tự động.</p>
            </div>
            <img src={user.avatarUrl} alt="avatar" className="h-28 w-28 rounded-3xl border border-pink-200 object-cover" />
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-pink-100 bg-pink-50 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-pink-500">Tên đầy đủ</p>
              <p className="mt-3 text-xl font-semibold text-slate-900">{user.name}</p>
            </div>
            <div className="rounded-3xl border border-pink-100 bg-pink-50 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-pink-500">Email</p>
              <p className="mt-3 text-xl font-semibold text-slate-900">{user.email}</p>
            </div>
            <div className="rounded-3xl border border-pink-100 bg-pink-50 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-pink-500">Mã số</p>
              <p className="mt-3 text-xl font-semibold text-slate-900">{user.id}</p>
            </div>
            {user.role === 'student' ? (
              <>
                <div className="rounded-3xl border border-pink-100 bg-pink-50 p-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-pink-500">Lớp</p>
                  <p className="mt-3 text-xl font-semibold text-slate-900">{user.className ?? 'Chưa cập nhật'}</p>
                </div>
                <div className="rounded-3xl border border-pink-100 bg-pink-50 p-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-pink-500">Vai trò</p>
                  <p className="mt-3 text-xl font-semibold text-slate-900">Học sinh</p>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-3xl border border-pink-100 bg-pink-50 p-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-pink-500">Bộ môn</p>
                  <p className="mt-3 text-xl font-semibold text-slate-900">{user.subject ?? 'Chưa cập nhật'}</p>
                </div>
                <div className="rounded-3xl border border-pink-100 bg-pink-50 p-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-pink-500">Lớp chủ nhiệm</p>
                  <p className="mt-3 text-xl font-semibold text-slate-900">{user.homeRoom ?? 'Chưa cập nhật'}</p>
                </div>
              </>
            )}
          </div>

          <div className="mt-8 rounded-3xl border border-pink-100 bg-pink-50 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-pink-500">Ghi chú của admin</p>
            <p className="mt-3 text-slate-600">Tài khoản này chỉ dùng để truy cập hệ thống điểm danh. Đổi mật khẩu và cấu hình quyền do admin quản lý.</p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link to={PATHS.DASHBOARD} className="inline-flex items-center justify-center rounded-2xl border border-pink-200 bg-white px-6 py-3 text-slate-900 transition hover:bg-pink-50">
              Quay lại trang chính
            </Link>
            {user.role === 'student' && (
              <Link to={PATHS.FACE_SCAN} className="inline-flex items-center justify-center rounded-2xl bg-pink-600 px-6 py-3 text-white transition hover:bg-pink-500">
                Mở trang điểm danh
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
