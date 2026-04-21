import http from '~/utils/http'
import type { CreateUserRequest, UpdateUserRequest, UserItem } from '~/types'

type SearchUserResult = {
  user_id: number
  user_code: string
  email: string
  full_name: string
  class_id: number | null
  roles: string[]
}

type MyAttendanceRecord = {
  attendance_id: number
  attendance_session_id: number
  check_in_time: string
  attendance_status: string
  session_date: string
  start_time: string
  end_time: string
  session_status: string
  class_id: number
  class_name: string
  captured_image_url?: string | null
  similarity_score?: number | null
}

const userApi = {
  getAll: (params?: { q?: string; role?: string; status?: string; page?: number; limit?: number }) =>
    http.get<{ users: UserItem[]; pagination: { total: number; page: number; limit: number; total_pages: number } }>(
      '/users',
      { params }
    ),
  getTeachers: () =>
    http.get<Array<Pick<UserItem, 'user_id' | 'full_name' | 'email' | 'user_code'>>>('/users/teachers'),
  getById: (id: number) => http.get<UserItem>(`/users/${id}`),
  create: (body: CreateUserRequest) => http.post('/users', body),
  createStudent: (body: Omit<CreateUserRequest, 'role_name'>) => http.post('/users/students', body),
  update: (id: number, body: UpdateUserRequest) => http.put(`/users/${id}`, body),
  delete: (id: number) => http.delete(`/users/${id}`),
  searchByEmail: (q: string) => http.get<SearchUserResult[]>('/users/search', { params: { q } }),
  getMyAttendance: () => http.get<{ records: MyAttendanceRecord[]; total: number }>('/users/my/attendance')
}

export default userApi
