import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { loginSchema, type LoginFormData } from '~/utils/schemas'
import authApi from '~/apis/auth.api'
import { useApp } from '~/contexts/app.context'
import PATHS from '~/constants/paths'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useApp()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (res) => {
      const { token, user } = res.data
      // Lấy thông tin profile đầy đủ
      const meRes = await authApi.getMe(token)
      setAuth(meRes.data.user, meRes.data.roles, token)

      toast.success(`Chào mừng ${user.full_name}!`)

      // Điều hướng dựa trên role
      if (meRes.data.roles.includes('admin')) {
        navigate(PATHS.ADMIN)
      } else {
        navigate(PATHS.DASHBOARD)
      }
    }
  })

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data)
  }

  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-pink-50 px-4 text-slate-900'>
      <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(251,207,232,0.25),_transparent_20%)]' />

      <div className='w-full max-w-4xl rounded-[2rem] border border-pink-200 bg-white p-8 shadow-[0_35px_120px_-30px_rgba(219,39,119,0.25)]'>
        <div className='grid items-center gap-10 lg:grid-cols-[1.2fr_0.85fr]'>
          {/* Left Side - Info */}
          <div className='space-y-6'>
            <div className='inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 text-sm uppercase tracking-[0.35em] text-pink-600'>
              FaceCloud School
            </div>
            <div className='space-y-4'>
              <h1 className='text-4xl font-semibold text-slate-900 sm:text-5xl'>Đăng nhập hệ thống</h1>
              <p className='max-w-xl leading-8 text-slate-600'>
                Chào mừng bạn đến với FaceCloud — hệ thống điểm danh bằng khuôn mặt. Đăng nhập để tiếp tục.
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className='rounded-[1.75rem] border border-pink-200 bg-white p-8 shadow-[0_30px_80px_-40px_rgba(219,39,119,0.15)]'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-slate-700'>Email</label>
                <input
                  {...register('email')}
                  type='email'
                  placeholder='you@example.com'
                  className='w-full rounded-3xl border border-pink-200 bg-pink-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20'
                />
                {errors.email && <p className='text-sm text-rose-500'>{errors.email.message}</p>}
              </div>

              <div className='space-y-2'>
                <label className='block text-sm font-medium text-slate-700'>Mật khẩu</label>
                <input
                  {...register('password')}
                  type='password'
                  placeholder='••••••••'
                  className='w-full rounded-3xl border border-pink-200 bg-pink-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20'
                />
                {errors.password && <p className='text-sm text-rose-500'>{errors.password.message}</p>}
              </div>

              <button
                type='submit'
                disabled={loginMutation.isPending}
                className='w-full rounded-3xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>

            <div className='mt-4 rounded-3xl border border-pink-200 bg-pink-50 p-5 text-sm text-slate-600'>
              <p className='font-medium text-slate-800'>Lưu ý</p>
              <p className='mt-2 leading-7'>
                Hệ thống sẽ tự động phân quyền dựa trên tài khoản của bạn (Admin / Giáo viên / Học sinh).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
