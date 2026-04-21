import http from '~/utils/http'
import type { NotificationItem } from '~/types'

const notificationApi = {
  getAll: () => http.get<NotificationItem[]>('/notifications'),
  markAsRead: (id: number) => http.put(`/notifications/${id}/read`)
}

export default notificationApi
