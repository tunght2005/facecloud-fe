import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '~/contexts/app.context'
import PATHS from '~/constants/paths'
import { FiBookOpen, FiClipboard, FiHome, FiLogOut, FiUsers, FiMenu, FiX, FiCheck, FiList } from 'react-icons/fi'

export default function AdminLayout() {
  const { user, roles, clearAuth } = useApp()
  const location = useLocation()
  const isAdmin = roles.includes('admin')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    ...(isAdmin ? [{ label: 'Người dùng', path: PATHS.ADMIN_USERS, icon: FiUsers }] : []),
    { label: 'Lớp học', path: PATHS.ADMIN_CLASSES, icon: FiBookOpen },
    { label: 'Điểm danh', path: PATHS.ADMIN_ATTENDANCE, icon: FiClipboard },
    { label: 'Logs điểm danh', path: PATHS.ADMIN_ATTENDANCE_LOGS, icon: FiList },
    { label: 'Quyền khuôn mặt', path: PATHS.ADMIN_FACE_PERMISSIONS, icon: FiCheck }
  ]

  const handleLogout = () => {
    clearAuth()
  }

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className='flex min-h-screen bg-pink-50'>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className='fixed inset-0 z-40 bg-slate-900/50 lg:hidden' onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-pink-200 bg-white transition-transform lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex items-center justify-between border-b border-pink-100 p-6'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 text-lg font-bold text-white'>
              F
            </div>
            <div>
              <h2 className='text-lg font-bold text-slate-900'>FaceCloud</h2>
              <p className='text-xs font-semibold uppercase tracking-wider text-pink-500'>Admin Panel</p>
            </div>
          </div>
          <button onClick={closeSidebar} className='rounded-lg p-1 text-slate-400 hover:bg-slate-100 lg:hidden'>
            <FiX className='text-xl' />
          </button>
        </div>

        <nav className='flex-1 space-y-1 overflow-y-auto p-4'>
          <p className='mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400'>Quản lý</p>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-pink-50 text-pink-600 shadow-sm shadow-pink-100'
                    : 'text-slate-600 hover:bg-pink-50 hover:text-pink-600'
                }`}
              >
                <item.icon className='shrink-0 text-base' />
                <span className='truncate'>{item.label}</span>
              </Link>
            )
          })}

          <div className='my-4 border-t border-pink-100' />
          <Link
            to={PATHS.DASHBOARD}
            onClick={closeSidebar}
            className='flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-pink-50 hover:text-pink-600'
          >
            <FiHome className='shrink-0 text-base' />
            Trang chủ
          </Link>
        </nav>

        <div className='border-t border-pink-100 p-4'>
          <div className='rounded-2xl bg-pink-50 p-3'>
            <p className='truncate text-sm font-semibold text-pink-600'>{user?.full_name || 'Admin'}</p>
            <p className='truncate text-xs text-slate-400'>{roles.join(', ')}</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className='flex min-w-0 flex-1 flex-col'>
        <header className='flex items-center justify-between border-b border-pink-200 bg-white/80 px-4 py-4 backdrop-blur-md lg:px-6'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => setSidebarOpen(true)}
              className='rounded-lg p-2 text-slate-600 hover:bg-pink-50 lg:hidden'
            >
              <FiMenu className='text-xl' />
            </button>
            <div>
              <h1 className='text-xl font-bold text-slate-900'>Admin Dashboard</h1>
              <p className='text-sm text-slate-500'>Quản lý hệ thống FaceCloud</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className='flex items-center gap-2 rounded-2xl bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-400'
          >
            <FiLogOut className='text-base' />
            Đăng xuất
          </button>
        </header>

        <main className='flex-1 overflow-auto p-4 lg:p-6'>
          <div className='rounded-3xl border border-pink-100 bg-white p-4 shadow-lg shadow-pink-100/50 lg:p-6'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
