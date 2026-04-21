import http from '~/utils/http'
import type { AuthResponse, LoginRequest, MeResponse, RegisterRequest } from '~/types'

const authApi = {
  login: (body: LoginRequest) => http.post<AuthResponse>('/auth/login', body),
  register: (body: RegisterRequest) => http.post('/auth/register', body),
  getMe: (token?: string) =>
    http.get<MeResponse>('/auth/me', {
      headers: token
        ? {
            Authorization: `Bearer ${token}`
          }
        : undefined
    })
}

export default authApi
