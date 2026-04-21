import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useState } from 'react'
import userApi from '~/apis/user.api'
import PATHS from '~/constants/paths'
import { FiTrash2, FiUserPlus } from 'react-icons/fi'
import Pagination from '~/components/common/Pagination'
import SearchInput from '~/components/common/SearchInput'
import FilterSelect from '~/components/common/FilterSelect'

export default function UsersPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const limit = 5

  const { data, isLoading } = useQuery({
    queryKey: ['users', searchTerm, roleFilter, statusFilter, page],
    queryFn: () => userApi.getAll({ q: searchTerm, role: roleFilter, status: statusFilter, page, limit })
  })

  const deleteMutation = useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => {
      toast.success('Xoá người dùng thành công!')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  const users = (Array.isArray(data?.data?.users) ? data.data.users : []) as any[]
  const pagination = data?.data?.pagination

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc muốn xoá người dùng này?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Quản lý Người dùng</h2>
          <p className="mt-1 text-sm text-slate-500">Thêm, sửa, xoá tài khoản trong hệ thống</p>
        </div>
        <Link to={PATHS.ADMIN_USERS_CREATE} className="flex items-center gap-2 rounded-2xl bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-400 shadow-lg shadow-pink-200">
          <FiUserPlus /> Thêm người dùng
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SearchInput
          placeholder="Tìm tên, email, mã..."
          value={searchTerm}
          onChange={(val) => { setSearchTerm(val); setPage(1); }}
        />
        <FilterSelect
          placeholder="Tất cả vai trò"
          value={roleFilter}
          onChange={(val) => { setRoleFilter(val); setPage(1); }}
          options={[
            { label: 'Admin', value: 'admin' },
            { label: 'Teacher', value: 'teacher' },
            { label: 'Student', value: 'student' }
          ]}
        />
        <FilterSelect
          placeholder="Tất cả trạng thái"
          value={statusFilter}
          onChange={(val) => { setStatusFilter(val); setPage(1); }}
          options={[
            { label: 'Hoạt động', value: 'active' },
            { label: 'Khoá', value: 'inactive' }
          ]}
        />
        <div className="flex items-center rounded-2xl border border-pink-100 bg-pink-50/50 px-4 py-2.5 text-sm text-slate-600">
          Tổng: <span className="ml-1 font-bold text-pink-600">{pagination?.total || 0}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400">Đang tải...</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-3xl border border-pink-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pink-50 bg-pink-50/30 text-left text-xs uppercase tracking-wider font-black text-pink-600">
                  <th className="px-6 py-4 text-center">ID</th>
                  <th className="px-6 py-4">Thông tin người dùng</th>
                  <th className="px-6 py-4">Vai trò</th>
                  <th className="px-6 py-4 text-center">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                {users.map((user) => (
                  <tr key={user.user_id} className="transition hover:bg-pink-50/30">
                    <td className="px-6 py-4 text-center font-medium text-slate-500">{user.user_id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900">{user.full_name}</p>
                        <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-pink-400">{user.user_code}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(user.roles || []).map((role: string) => (
                          <span key={role} className="rounded-full bg-pink-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-pink-600 tracking-tighter">
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${user.user_status === 'active' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                        {user.user_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(user.user_id)}
                        className="rounded-xl border border-rose-100 p-2 text-rose-400 transition hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                        title="Xoá người dùng"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-medium">Không tìm thấy người dùng nào</td></tr>
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
