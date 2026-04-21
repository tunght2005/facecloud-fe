import http from '~/utils/http'
import type { FaceProfile, FaceRegisterRequest, FaceVerifyRequest } from '~/types'

type FaceProfileResponse = {
  face_profile: FaceProfile
}

const faceApi = {
  uploadImage: (file: File, type: 'face' | 'captured' = 'face') => {
    const formData = new FormData()
    formData.append('image', file)
    return http.post<{ image_url: string }>(`/face/upload?type=${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  getProfile: () => http.get<FaceProfileResponse>('/face/profile'),
  getProfileByUser: (userId: number) => http.get<FaceProfileResponse>(`/face/profile/${userId}`),
  register: (body: FaceRegisterRequest) => http.post('/face/register', body),
  verify: (body: FaceVerifyRequest) => http.post('/face/verify', body),
  compare: (body: FaceVerifyRequest) => http.post('/face/compare', body),
  compareByUser: (userId: number, body: FaceVerifyRequest) => http.post(`/face/compare/${userId}`, body),
  getHistory: (limit = 20) => http.get('/face/history', { params: { limit } }),
  getHistoryByUser: (userId: number, limit = 20) => http.get(`/face/history/${userId}`, { params: { limit } }),
  getPermissions: (params?: { q?: string; page?: number; limit?: number }) =>
    http.get<{ users: any[]; pagination: { total: number; page: number; limit: number; total_pages: number } }>(
      '/face/permissions',
      { params }
    ),
  togglePermission: (body: { user_id: number; can_update: boolean }) => http.post('/face/permissions/toggle', body)
}

export default faceApi
