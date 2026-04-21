import { useRoutes, Navigate } from 'react-router-dom'
import PATHS from '~/constants/paths'
import { ProtectedRoute, RejectedRoute, AdminRoute, RoleRoute } from '~/components/RouteGuards'

// Pages
import LoginPage from '~/pages/LoginPage'
import RegisterPage from '~/pages/RegisterPage'
import Dashboard from '~/pages/Dashboard'
import ProfilePage from '~/pages/ProfilePage'
import FaceScanPage from '~/pages/FaceScanPage'
import FaceRegisterPage from '~/pages/FaceRegisterPage'
import NotificationsPage from '~/pages/NotificationsPage'

// Admin
import AdminLayout from '~/layouts/AdminLayout'
import UsersPage from '~/pages/admin/UsersPage'
import CreateUserPage from '~/pages/admin/CreateUserPage'
import ClassesPage from '~/pages/admin/ClassesPage'
import CreateClassPage from '~/pages/admin/CreateClassPage'
import AttendancePage from '~/pages/admin/AttendancePage'
import CreateSessionPage from '~/pages/admin/CreateSessionPage'
import AttendanceLogsPage from '~/pages/admin/AttendanceLogsPage'
import FacePermissionsPage from '~/pages/admin/FacePermissionsPage'

export default function useRouteElements() {
  const routeElements = useRoutes([
    // ===== Rejected Routes (chưa đăng nhập mới vào được) =====
    {
      element: <RejectedRoute />,
      children: [
        { path: PATHS.LOGIN, element: <LoginPage /> },
        { path: PATHS.REGISTER, element: <RegisterPage /> }
      ]
    },

    // ===== Protected Routes (phải đăng nhập) =====
    {
      element: <ProtectedRoute />,
      children: [
        { path: PATHS.DASHBOARD, element: <Dashboard /> },
        { path: PATHS.PROFILE, element: <ProfilePage /> },
        { path: PATHS.FACE_SCAN, element: <FaceScanPage /> },
        { path: PATHS.FACE_REGISTER, element: <FaceRegisterPage /> },
        { path: PATHS.NOTIFICATIONS, element: <NotificationsPage /> }
      ]
    },

    // ===== Admin Routes (phải là admin) =====
    {
      element: <AdminRoute />,
      children: [
        {
          path: PATHS.ADMIN,
          element: <AdminLayout />,
          children: [
            { index: true, element: <Navigate to={PATHS.ADMIN_CLASSES} replace /> },
            {
              element: <RoleRoute allow={['admin']} redirectTo={PATHS.ADMIN_CLASSES} />,
              children: [
                { path: PATHS.ADMIN_USERS, element: <UsersPage /> },
                { path: PATHS.ADMIN_USERS_CREATE, element: <CreateUserPage /> }
              ]
            },
            { path: PATHS.ADMIN_CLASSES, element: <ClassesPage /> },
            { path: PATHS.ADMIN_CLASSES_CREATE, element: <CreateClassPage /> },
            { path: PATHS.ADMIN_ATTENDANCE, element: <AttendancePage /> },
            { path: PATHS.ADMIN_ATTENDANCE_CREATE, element: <CreateSessionPage /> },
            { path: PATHS.ADMIN_ATTENDANCE_LOGS, element: <AttendanceLogsPage /> },
            { path: PATHS.ADMIN_FACE_PERMISSIONS, element: <FacePermissionsPage /> }
          ]
        }
      ]
    },

    // ===== Fallback =====
    { path: PATHS.HOME, element: <Navigate to={PATHS.LOGIN} replace /> },
    { path: '*', element: <Navigate to={PATHS.HOME} replace /> }
  ])

  return routeElements
}
