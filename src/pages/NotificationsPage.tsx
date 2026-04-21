import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import notificationApi from '~/apis/notification.api'
import PATHS from '~/constants/paths'

export default function NotificationsPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getAll()
  })

  const markReadMutation = useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })

  const notifications = (Array.isArray(data?.data) ? data.data : []) as any[]

  return (
    <div className='min-h-screen bg-pink-50 px-4 py-10'>
      <div className='mx-auto max-w-2xl'>
        <Link
          to={PATHS.DASHBOARD}
          className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-pink-600 hover:text-pink-500'
        >
          ← Quay lại Dashboard
        </Link>

        <h1 className='mb-6 text-3xl font-bold text-slate-900'>Thông báo</h1>

        {isLoading ? (
          <div className='py-20 text-center text-slate-400'>Đang tải...</div>
        ) : notifications.length === 0 ? (
          <div className='rounded-3xl border border-pink-200 bg-white p-10 text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-2xl'>
              🔔
            </div>
            <p className='text-slate-500'>Chưa có thông báo nào.</p>
          </div>
        ) : (
          <div className='space-y-3'>
            {notifications.map((n) => (
              <div
                key={n.notification_id}
                className={`rounded-2xl border p-5 transition ${n.is_read ? 'border-pink-100 bg-white' : 'border-pink-300 bg-pink-50 shadow-sm'}`}
              >
                <div className='flex items-start justify-between'>
                  <div>
                    <h3 className='font-semibold text-slate-900'>{n.title}</h3>
                    <p className='mt-1 text-sm text-slate-600'>{n.message}</p>
                    <p className='mt-2 text-xs text-slate-400'>{new Date(n.created_at).toLocaleString('vi-VN')}</p>
                  </div>
                  {!n.is_read && (
                    <button
                      onClick={() => markReadMutation.mutate(n.notification_id)}
                      className='shrink-0 rounded-xl border border-pink-200 px-3 py-1.5 text-xs font-medium text-pink-600 transition hover:bg-pink-100'
                    >
                      Đã đọc
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
