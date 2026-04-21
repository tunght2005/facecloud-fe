import { useState, type ReactNode } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import PATHS from '../constants/paths'
import type { User } from '../types'

// Pages
import LoginPage from '../pages/LoginPage'
import Dashboard from '../pages/Dashboard'
import ProfilePage from '../pages/ProfilePage'
import FaceScanPage from '../pages/FaceScanPage'

// Admin
import AdminLayout from '../layouts/AdminLayout'

// ===== Protected Route =====
function ProtectedRoute({ user, children }: { user: User | null; children: ReactNode }) {
  if (!user) {
    return <Navigate to={PATHS.LOGIN} replace />
  }
  return <>{children}</>
}

// ===== Hook =====
export default function useRouteElements() {
  const [user, setUser] = useState<User | null>(null)

  const handleLogin = (userData: User) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  const routeElements = useRoutes([
    // ===== Trang chủ =====
    {
      path: PATHS.HOME,
      element: <Navigate to={user ? PATHS.DASHBOARD : PATHS.LOGIN} replace />,
    },

    // ===== Student / Teacher Login =====
    {
      path: PATHS.LOGIN,
      element: user ? (
        <Navigate to={PATHS.DASHBOARD} replace />
      ) : (
        <LoginPage onLogin={handleLogin} />
      ),
    },

    // ===== Dashboard (Student / Teacher) =====
    {
      path: PATHS.DASHBOARD,
      element: (
        <ProtectedRoute user={user}>
          <Dashboard user={user!} onLogout={handleLogout} />
        </ProtectedRoute>
      ),
    },

    // ===== Profile =====
    {
      path: PATHS.PROFILE,
      element: (
        <ProtectedRoute user={user}>
          <ProfilePage user={user!} />
        </ProtectedRoute>
      ),
    },

    // ===== Face Scan =====
    {
      path: PATHS.FACE_SCAN,
      element: (
        <ProtectedRoute user={user}>
          <FaceScanPage user={user!} />
        </ProtectedRoute>
      ),
    },

    // ===== Admin Dashboard =====
    {
      path: PATHS.ADMIN,
      element: <AdminLayout />,
    },

    // ===== Fallback =====
    {
      path: '*',
      element: <Navigate to={PATHS.HOME} replace />,
    },
  ])

  return routeElements
}
