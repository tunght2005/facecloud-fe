import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { registerSchema, type RegisterFormData } from '~/utils/schemas'
import authApi from '~/apis/auth.api'
import PATHS from '~/constants/paths'

export default function RegisterPage() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.')
      navigate(PATHS.LOGIN)
    }
  })

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-pink-50 px-4 text-slate-900">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(251,207,232,0.25),_transparent_20%)]" />

      <div className="w-full max-w-md rounded-[2rem] border border-pink-200 bg-white p-8 shadow-[0_35px_120px_-30px_rgba(219,39,119,0.25)]">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 text-sm uppercase tracking-[0.35em] text-pink-600">
            FaceCloud
          </div>
          <h1 className="text-3xl font-semibold text-slate-900">Đăng ký tài khoản</h1>
          <p className="mt-2 text-slate-500">Tạo tài khoản mới để sử dụng hệ thống</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Họ tên</label>
            <input
              {...register('full_name')}
              placeholder="Nguyễn Văn A"
              className="w-full rounded-3xl border border-pink-200 bg-pink-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
            />
            {errors.full_name && <p className="text-sm text-rose-500">{errors.full_name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Mã người dùng</label>
            <input
              {...register('user_code')}
              placeholder="SV001"
              className="w-full rounded-3xl border border-pink-200 bg-pink-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
            />
            {errors.user_code && <p className="text-sm text-rose-500">{errors.user_code.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-3xl border border-pink-200 bg-pink-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
            />
            {errors.email && <p className="text-sm text-rose-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Mật khẩu</label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full rounded-3xl border border-pink-200 bg-pink-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
            />
            {errors.password && <p className="text-sm text-rose-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full rounded-3xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {registerMutation.isPending ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-slate-500">
          Đã có tài khoản?{' '}
          <Link to={PATHS.LOGIN} className="font-semibold text-pink-600 hover:text-pink-500">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  )
}
