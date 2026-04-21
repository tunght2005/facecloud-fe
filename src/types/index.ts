// ===== Auth =====
export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  email: string
  password: string
  full_name: string
  user_code: string
}

export type AuthResponse = {
  message: string
  token: string
  user: {
    user_id: number
    email: string
    full_name: string
    user_code: string
    class_id: number | null
    class_name: string | null
    roles: string[]
  }
}

export type MeResponse = {
  user: UserProfile
  roles: string[]
}

export type UserProfile = {
  user_id: number
  user_code: string
  email: string
  full_name: string
  avatar_url: string | null
  class_id: number | null
  class_name: string | null
  user_status: string
}

// ===== Users (Admin) =====
export type CreateUserRequest = {
  email: string
  password: string
  full_name: string
  user_code: string
  class_id?: number
  role_name: string
}

export type UpdateUserRequest = {
  full_name?: string
  class_id?: number
  user_status?: string
}

export type UserItem = {
  user_id: number
  user_code: string
  email: string
  full_name: string
  avatar_url: string | null
  class_id: number | null
  user_status: string
  roles: string[]
}

// ===== Classes =====
export type ClassItem = {
  class_id: number
  class_name: string
  teacher_name: string | null
  teacher_id: number | null
  student_count: number
}

export type CreateClassRequest = {
  class_name: string
  teacher_id?: number
  student_ids?: number[]
}

export type ClassStudent = {
  user_id: number
  user_code: string
  email: string
  full_name: string
  avatar_url: string | null
}

// ===== Attendance =====
export type CreateSessionRequest = {
  class_id: number
  session_date: string
  start_time: string
  end_time: string
}

export type SessionActionRequest = {
  attendance_session_id: number
}

export type AttendanceSession = {
  attendance_session_id: number
  class_id: number
  class_name?: string
  session_date: string
  start_time: string
  end_time: string
  status: string
  created_by: number
}

export type AttendanceRecord = {
  attendance_id: number
  attendance_session_id: number
  user_id: number
  full_name: string
  user_code: string
  attendance_status: string
  check_in_time: string
  captured_image_url?: string | null
}

// ===== Face =====
export type FaceProfile = {
  user_id: number
  face_aws_id: string | null
  aws_collection_id: string | null
  face_image_url: string | null
  created_at: string
}

export type FaceRegisterRequest = {
  imageBase64: string
  face_image_url?: string
}

export type FaceVerifyRequest = {
  imageBase64: string
  captured_image_url?: string
}

export type AttendanceScanRequest = {
  imageBase64: string
  attendance_session_id: number
  captured_image_url?: string
}

// ===== Notification =====
export type NotificationItem = {
  notification_id: number
  user_id: number
  title: string
  message: string
  is_read: boolean
  created_at: string
}

// ===== API Error =====
export type ApiError = {
  error: string
}
