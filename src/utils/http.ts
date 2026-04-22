import axios, { type AxiosInstance } from 'axios'
import { toast } from 'react-toastify'

const http: AxiosInstance = axios.create({
  baseURL: 'https://wal-capable-took-passing.trycloudflare.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// ===== Request Interceptor =====
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// ===== Response Interceptor =====
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Đã có lỗi xảy ra'
    const status = error.response?.status

    console.error(`❌ [${status}] API Error:`, message)

    if (status === 401) {
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    } else if (status === 403) {
      toast.error('Bạn không có quyền truy cập tài nguyên này.')
    } else if (status === 404) {
      toast.error('Không tìm thấy tài nguyên.')
    } else if (status === 500) {
      toast.error('Lỗi máy chủ. Vui lòng thử lại sau.')
    } else {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default http
