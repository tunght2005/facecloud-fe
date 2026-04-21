import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import authApi from '~/apis/auth.api'
import faceApi from '~/apis/face.api'
import { useApp } from '~/contexts/app.context'
import PATHS from '~/constants/paths'
import { toAbsoluteMediaUrl } from '~/utils/media'

export default function ProfilePage() {
  const { roles } = useApp()

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.getMe()
  })

  const { data: faceData } = useQuery({
    queryKey: ['face-profile'],
    queryFn: () => faceApi.getProfile(),
    retry: false
  })

  const user = data?.data?.user
  const userRoles = data?.data?.roles || roles
  const faceProfile = faceData?.data?.face_profile
  const faceImageUrl = toAbsoluteMediaUrl(faceProfile?.face_image_url)

  if (isLoading) {
    return <div className='flex min-h-screen items-center justify-center bg-pink-50 text-slate-400'>Đang tải...</div>
  }

  return (
    <div className='min-h-screen bg-pink-50 px-4 py-10'>
      <div className='mx-auto max-w-2xl'>
        <Link
          to={PATHS.DASHBOARD}
          className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-pink-600 hover:text-pink-500'
        >
          ← Quay lại Dashboard
        </Link>

        <div className='rounded-3xl border border-pink-200 bg-white p-8 shadow-lg shadow-pink-100/50'>
          <div className='mb-6 flex items-center gap-5'>
            <div className='flex h-20 w-20 items-center justify-center rounded-full bg-pink-100 text-3xl font-bold text-pink-600'>
              {user?.full_name?.charAt(0) || '?'}
            </div>
            <div>
              <h1 className='text-2xl font-bold text-slate-900'>{user?.full_name}</h1>
              <p className='text-slate-500'>{user?.email}</p>
              <div className='mt-2 flex gap-2'>
                {userRoles.map((r: string) => (
                  <span key={r} className='rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-600'>
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className='space-y-4 border-t border-pink-100 pt-6'>
            <div className='flex justify-between rounded-2xl bg-pink-50 p-4'>
              <span className='text-sm text-slate-500'>Mã người dùng</span>
              <span className='text-sm font-medium text-slate-900'>{user?.user_code || 'N/A'}</span>
            </div>
            <div className='flex justify-between rounded-2xl bg-pink-50 p-4'>
              <span className='text-sm text-slate-500'>Trạng thái</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${user?.user_status === 'active' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}
              >
                {user?.user_status || 'N/A'}
              </span>
            </div>
            <div className='flex justify-between rounded-2xl bg-pink-50 p-4'>
              <span className='text-sm text-slate-500'>Lớp</span>
              <span className='text-sm font-medium text-slate-900'>{user?.class_name || 'Chưa gán'}</span>
            </div>
          </div>

          <div className='mt-6 border-t border-pink-100 pt-6'>
            <h2 className='mb-3 text-lg font-semibold text-slate-900'>Khuôn mặt đã đăng ký</h2>
            {faceImageUrl ? (
              <div className='overflow-hidden rounded-2xl border border-pink-200 bg-pink-50'>
                <img src={faceImageUrl} alt='Registered face' className='max-h-72 w-full object-contain' />
              </div>
            ) : (
              <p className='rounded-2xl border border-dashed border-pink-200 bg-pink-50 p-4 text-sm text-slate-500'>
                Chưa có ảnh khuôn mặt đã đăng ký hoặc ảnh chưa có URL.
              </p>
            )}
          </div>

          <div className='mt-6 flex gap-3'>
            <Link
              to={PATHS.FACE_REGISTER}
              className='flex-1 rounded-2xl bg-pink-500 py-3 text-center text-sm font-semibold text-white transition hover:bg-pink-400'
            >
              Đăng ký khuôn mặt
            </Link>
            <Link
              to={PATHS.DASHBOARD}
              className='rounded-2xl border border-pink-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-pink-50'
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
