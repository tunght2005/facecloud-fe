const PATHS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  FACE_SCAN: '/face-scan',
  FACE_REGISTER: '/face-register',
  NOTIFICATIONS: '/notifications',
  // Admin routes
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_USERS_CREATE: '/admin/users/create',
  ADMIN_CLASSES: '/admin/classes',
  ADMIN_CLASSES_CREATE: '/admin/classes/create',
  ADMIN_ATTENDANCE: '/admin/attendance',
  ADMIN_ATTENDANCE_CREATE: '/admin/attendance/create',
  ADMIN_ATTENDANCE_LOGS: '/admin/attendance/logs',
  ADMIN_FACE_PERMISSIONS: '/admin/face-permissions'
} as const

export default PATHS
