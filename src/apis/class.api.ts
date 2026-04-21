import http from '~/utils/http'
import type { ClassItem, CreateClassRequest, ClassStudent } from '~/types'

type ClassListResponse = {
  success: boolean
  data: ClassItem[]
}

type ClassDetailResponse = {
  success: boolean
  data: ClassItem
}

type ClassStudentsResponse = {
  success: boolean
  data: ClassStudent[]
}

type AssignStudentsRequest = {
  student_ids: number[]
}

const classApi = {
  getAll: (params?: { q?: string; page?: number; limit?: number }) =>
    http.get<
      ClassListResponse & { pagination: { total: number; page: number; limit: number; total_pages: number } }
    >('/classes', { params }),
  getById: (id: number) => http.get<ClassDetailResponse>(`/classes/${id}`),
  create: (body: CreateClassRequest) => http.post('/classes', body),
  update: (id: number, body: CreateClassRequest) => http.put(`/classes/${id}`, body),
  delete: (id: number) => http.delete(`/classes/${id}`),
  getStudents: (classId: number) => http.get<ClassStudentsResponse>(`/classes/${classId}/students`),
  assignStudents: (classId: number, body: AssignStudentsRequest) => http.put(`/classes/${classId}/students`, body)
}

export default classApi
