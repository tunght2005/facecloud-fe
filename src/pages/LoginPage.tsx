import { useState, type FormEvent } from 'react'
import type { User } from '../App'

type LoginPageProps = {
  onLogin: (user: User) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'student' | 'teacher'>('student')
  const [error, setError] = useState('')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Vui lòng nhập email và mật khẩu')
      return
    }

    const validPassword = password.length >= 6
    if (!validPassword) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    onLogin({
      id: role === 'student' ? 'HS2026001' : 'GV2026001',
      role,
      name: role === 'student' ? 'Nguyễn Văn A' : 'Cô Nguyễn Thị B',
      email,
      avatarUrl: `https://api.dicebear.com/6.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      className: role === 'student' ? '12A1' : undefined,
      supervisor: role === 'student' ? 'Cô Nguyễn Thị B' : undefined,
      subject: role === 'teacher' ? 'Công nghệ thông tin' : undefined,
      homeRoom: role === 'teacher' ? '12A1' : undefined,
    })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-pink-50 px-4 py-10 text-slate-900">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(251,207,232,0.25),_transparent_20%)]" />

      <div className="mx-auto w-full max-w-4xl rounded-[2rem] bg-white p-8 shadow-[0_35px_120px_-30px_rgba(219,39,119,0.25)] border border-pink-200">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.85fr] items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 text-sm uppercase tracking-[0.35em] text-pink-600">
              FaceCloud School
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">Đăng nhập điểm danh</h1>
              <p className="max-w-xl text-slate-600 leading-8">
                Dành cho học sinh và giảng viên. Tài khoản được cấp bởi admin nên không có đăng ký tự do.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-pink-200 bg-pink-50 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-pink-500">Chức năng</p>
                <p className="mt-3 text-base font-medium text-slate-900">Chỉ đăng nhập</p>
              </div>
              <div className="rounded-3xl border border-pink-200 bg-pink-50 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-pink-500">Quyền truy cập</p>
                <p className="mt-3 text-base font-medium text-slate-900">Admin cấp mật khẩu</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-pink-200 bg-white p-8 shadow-[0_30px_80px_-40px_rgba(219,39,119,0.15)]">
            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-3xl border border-pink-200 bg-pink-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Mật khẩu</label>
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-3xl border border-pink-200 bg-pink-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
                    role === 'student'
                      ? 'border-pink-400 bg-pink-50 text-pink-700 shadow-sm shadow-pink-200'
                      : 'border-pink-200 bg-white text-slate-700 hover:border-pink-300'
                  }`}
                >
                  Học sinh
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
                    role === 'teacher'
                      ? 'border-pink-400 bg-pink-50 text-pink-700 shadow-sm shadow-pink-200'
                      : 'border-pink-200 bg-white text-slate-700 hover:border-pink-300'
                  }`}
                >
                  Giáo viên
                </button>
              </div>

              {error && <p className="text-sm text-rose-500">{error}</p>}

              <button className="w-full rounded-3xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-pink-400">
                Đăng nhập
              </button>
            </form>

            <div className="mt-6 rounded-3xl border border-pink-200 bg-pink-50 p-5 text-sm text-slate-600">
              <p className="font-medium text-slate-800">Lưu ý</p>
              <p className="mt-2 leading-7">Tài khoản chỉ cấp bởi admin. Nếu chưa có, hãy liên hệ quản trị để được cấp quyền truy cập.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
