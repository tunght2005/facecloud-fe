import http from '~/utils/http'
import type {
  AttendanceSession,
  AttendanceRecord,
  CreateSessionRequest,
  SessionActionRequest,
  AttendanceScanRequest
} from '~/types'

type SessionListResponse = {
  sessions: AttendanceSession[]
  pagination: { total: number; page: number; limit: number; total_pages: number }
}

const attendanceApi = {
  createSession: (body: CreateSessionRequest) => http.post('/attendance/session/create', body),
  openSession: (body: SessionActionRequest) => http.post('/attendance/session/open', body),
  closeSession: (body: SessionActionRequest) => http.post('/attendance/session/close', body),
  getSessionList: (params?: {
    class_id?: number
    status?: string
    q?: string
    date_from?: string
    date_to?: string
    page?: number
    limit?: number
  }) => http.get<SessionListResponse>('/attendance/session/list', { params }),
  getSessionDetails: (id: number) =>
    http.get<{ session: AttendanceSession; records: AttendanceRecord[] }>(`/attendance/session/${id}`),
  getAttendanceLogs: (params?: { attendance_session_id?: number; q?: string; page?: number; limit?: number }) =>
    http.get<{ logs: any[]; pagination: { total: number; page: number; limit: number; total_pages: number } }>(
      '/attendance/logs',
      { params }
    ),
  scan: (body: AttendanceScanRequest) => http.post('/attendance/scan', body),
  deleteSession: (id: number) => http.delete(`/attendance/session/${id}`),
  deleteRecord: (id: number) => http.delete(`/attendance/record/${id}`),
  manualAttendance: (body: { attendance_session_id: number; user_id: number; attendance_status?: string }) =>
    http.post('/attendance/manual', body)
}

export default attendanceApi
