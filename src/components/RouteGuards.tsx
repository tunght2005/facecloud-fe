import { Navigate, Outlet } from 'react-router-dom'
import { useApp } from '~/contexts/app.context'
import PATHS from '~/constants/paths'

// Chỉ cho phép user đã đăng nhập truy cập
export function ProtectedRoute() {
  const { isAuthenticated } = useApp()
  return isAuthenticated ? <Outlet /> : <Navigate to={PATHS.LOGIN} replace />
}

// Chỉ cho phép user CHƯA đăng nhập truy cập (login, register)
export function RejectedRoute() {
  const { isAuthenticated } = useApp()
  return !isAuthenticated ? <Outlet /> : <Navigate to={PATHS.DASHBOARD} replace />
}

// Chỉ cho phép admin hoặc teacher truy cập
export function AdminRoute() {
  const { isAuthenticated, roles } = useApp()
  if (!isAuthenticated) return <Navigate to={PATHS.LOGIN} replace />
  if (!roles.includes('admin') && !roles.includes('teacher')) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-pink-50'>
        <div className='rounded-3xl border border-pink-200 bg-white p-10 text-center shadow-xl shadow-pink-200/30'>
          <div className='mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-pink-100'>
            <svg
              className='h-10 w-10 text-pink-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
              />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-slate-800'>Không có quyền truy cập</h2>
          <p className='mt-3 text-slate-500'>Bạn cần quyền admin hoặc teacher để vào trang này.</p>
        </div>
      </div>
    )
  }
  return <Outlet />
}

type RoleRouteProps = {
  allow: string[]
  redirectTo?: string
}

export function RoleRoute({ allow, redirectTo = PATHS.ADMIN_CLASSES }: RoleRouteProps) {
  const { isAuthenticated, roles } = useApp()

  if (!isAuthenticated) {
    return <Navigate to={PATHS.LOGIN} replace />
  }

  const allowed = allow.some((role) => roles.includes(role))
  if (!allowed) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}
