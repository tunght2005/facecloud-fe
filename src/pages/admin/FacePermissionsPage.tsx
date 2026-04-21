import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useState } from 'react'
import faceApi from '~/apis/face.api'
import { FiUser, FiClock } from 'react-icons/fi'
import Pagination from '~/components/common/Pagination'
import SearchInput from '~/components/common/SearchInput'

const formatDate = (val: string | null | undefined) => {
  if (!val) return 'Chưa đăng ký'
  const d = new Date(val)
  if (isNaN(d.getTime())) return val
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function FacePermissionsPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const limit = 5

  const { data, isLoading } = useQuery({
    queryKey: ['face-permissions', searchTerm, page],
    queryFn: () => faceApi.getPermissions({ q: searchTerm, page, limit })
  })

  const users = Array.isArray(data?.data?.users) ? data.data.users : []
  const pagination = data?.data?.pagination

  const toggleMutation = useMutation({
    mutationFn: faceApi.togglePermission,
    onSuccess: () => {
      toast.success('Cập nhật quyền thành công!')
      queryClient.invalidateQueries({ queryKey: ['face-permissions'] })
    }
  })

  const handleToggle = (userId: number, currentCanUpdate: boolean) => {
    toggleMutation.mutate({ user_id: userId, can_update: !currentCanUpdate })
  }

  return (
    <div>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-slate-900'>Quyền cập nhật khuôn mặt</h2>
          <p className='mt-1 text-sm text-slate-500'>Cho phép học sinh đăng ký lại khuôn mặt nếu ảnh cũ bị lỗi hoặc thay đổi diện mạo.</p>
        </div>
      </div>

      <div className='mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <SearchInput
          placeholder='Tìm tên, mã sinh viên...'
          value={searchTerm}
          onChange={(val) => { setSearchTerm(val); setPage(1); }}
        />
        <div className='flex items-center rounded-2xl border border-pink-100 bg-pink-50/50 px-4 py-2.5 text-sm text-slate-600 font-medium'>
          Tổng cộng: <span className='ml-1 font-bold text-pink-600'>{pagination?.total || 0}</span> học sinh
        </div>
      </div>

      {isLoading ? (
        <div className='py-20 text-center text-slate-400'>Đang tải...</div>
      ) : (
        <>
          <div className='overflow-x-auto rounded-3xl border border-pink-100 bg-white shadow-sm'>
            <table className='w-full text-sm text-left'>
              <thead>
                <tr className='border-b border-pink-50 bg-pink-50/30 text-[10px] font-black uppercase tracking-widest text-pink-600'>
                  <th className='px-6 py-4'>Học sinh</th>
                  <th className='px-6 py-4 text-center'>Trạng thái khuôn mặt</th>
                  <th className='px-6 py-4 text-center'>Ngày đăng ký</th>
                  <th className='px-6 py-4 text-center'>Quyền cập nhật</th>
                  <th className='px-6 py-4 text-right'>Thao tác</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-pink-50'>
                {users.map((user: any) => (
                  <tr key={user.user_id} className='transition hover:bg-pink-50/20'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-pink-600 shadow-inner'>
                          <FiUser />
                        </div>
                        <div>
                          <p className='font-bold text-slate-900'>{user.full_name}</p>
                          <p className='text-[10px] font-black uppercase tracking-widest text-slate-400'>{user.user_code} • {user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 text-center'>
                      {user.has_face ? (
                        <span className='inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-600'>
                          Đã đăng ký
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-slate-500'>
                          Chưa đăng ký
                        </span>
                      )}
                    </td>
                    <td className='px-6 py-4 text-center'>
                      {user.has_face ? (
                        <div className='inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100'>
                          <FiClock className='text-pink-400' /> {formatDate(user.face_registered_at)}
                        </div>
                      ) : <span className='text-slate-300'>—</span>}
                    </td>
                    <td className='px-6 py-4 text-center'>
                      {user.can_update_face ? (
                        <span className='inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-amber-600'>
                          Mở quyền
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-slate-500'>
                          Đang khoá
                        </span>
                      )}
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <button
                        onClick={() => handleToggle(user.user_id, user.can_update_face)}
                        disabled={toggleMutation.isPending}
                        className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-black uppercase tracking-tighter transition shadow-sm ${
                          user.can_update_face
                            ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                            : 'bg-pink-500 text-white hover:bg-pink-400 shadow-pink-100'
                        }`}
                      >
                        {user.can_update_face ? (
                          <>Khoá lại</>
                        ) : (
                          <>Mở quyền</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className='py-20 text-center text-slate-400 font-medium'>
                      Không tìm thấy học sinh nào khớp với tìm kiếm
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            total_pages={pagination?.total_pages || 0}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}
