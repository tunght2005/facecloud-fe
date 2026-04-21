import { useMemo, useState, useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import classApi from '~/apis/class.api'
import userApi from '~/apis/user.api'
import { useApp } from '~/contexts/app.context'
import type { ClassItem } from '~/types'
import { FiEdit2, FiTrash2, FiUserPlus, FiPlusCircle } from 'react-icons/fi'
import Pagination from '~/components/common/Pagination'
import SearchInput from '~/components/common/SearchInput'

type ClassFormState = {
  class_name: string
  teacher_id: string
}

type SearchResult = {
  user_id: number
  user_code: string
  email: string
  full_name: string
  class_id: number | null
  roles: string[]
}

const defaultClassForm: ClassFormState = {
  class_name: '',
  teacher_id: ''
}

export default function ClassesPage() {
  const queryClient = useQueryClient()
  const { roles } = useApp()
  const isAdmin = roles.includes('admin')

  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const limit = 5

  const [openCreateClassModal, setOpenCreateClassModal] = useState(false)
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null)
  const [studentClass, setStudentClass] = useState<ClassItem | null>(null)
  const [classForm, setClassForm] = useState<ClassFormState>(defaultClassForm)

  const [emailQuery, setEmailQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['classes', searchTerm, page],
    queryFn: () => classApi.getAll({ q: searchTerm, page, limit })
  })

  const { data: teachersRes } = useQuery({
    queryKey: ['teachers-options-classes-page'],
    enabled: isAdmin,
    queryFn: () => userApi.getTeachers()
  })

  const classes = (Array.isArray(data?.data?.data) ? data.data.data : []) as ClassItem[]
  const pagination = data?.data?.pagination
  const teachers = Array.isArray(teachersRes?.data) ? teachersRes.data : []

  const teacherLabelById = useMemo(() => {
    const map = new Map<number, string>()
    teachers.forEach((teacher) => {
      map.set(teacher.user_id, `${teacher.full_name} (${teacher.user_code || teacher.email})`)
    })
    return map
  }, [teachers])

  const invalidateClasses = () => {
    queryClient.invalidateQueries({ queryKey: ['classes'] })
  }

  const createClassMutation = useMutation({
    mutationFn: classApi.create,
    onSuccess: () => {
      toast.success('Tạo lớp học thành công')
      setOpenCreateClassModal(false)
      setClassForm(defaultClassForm)
      invalidateClasses()
    }
  })

  const updateClassMutation = useMutation({
    mutationFn: ({ classId, payload }: { classId: number; payload: { class_name: string; teacher_id?: number } }) =>
      classApi.update(classId, payload),
    onSuccess: () => {
      toast.success('Cập nhật lớp học thành công')
      setEditingClass(null)
      setClassForm(defaultClassForm)
      invalidateClasses()
    }
  })

  const deleteClassMutation = useMutation({
    mutationFn: classApi.delete,
    onSuccess: () => {
      toast.success('Xóa lớp học thành công')
      invalidateClasses()
    }
  })

  const assignStudentMutation = useMutation({
    mutationFn: ({ classId, studentIds }: { classId: number; studentIds: number[] }) =>
      classApi.assignStudents(classId, { student_ids: studentIds }),
    onSuccess: () => {
      toast.success('Thêm học sinh vào lớp thành công!')
      setEmailQuery('')
      setSearchResults([])
      invalidateClasses()
    }
  })

  const submitCreateClass = () => {
    if (!classForm.class_name.trim()) {
      toast.error('Tên lớp không được để trống')
      return
    }
    createClassMutation.mutate({
      class_name: classForm.class_name.trim(),
      teacher_id: classForm.teacher_id ? Number(classForm.teacher_id) : undefined
    })
  }

  const submitUpdateClass = () => {
    if (!editingClass) return
    if (!classForm.class_name.trim()) {
      toast.error('Tên lớp không được để trống')
      return
    }
    updateClassMutation.mutate({
      classId: editingClass.class_id,
      payload: {
        class_name: classForm.class_name.trim(),
        teacher_id: classForm.teacher_id ? Number(classForm.teacher_id) : undefined
      }
    })
  }

  const handleSearchEmail = useCallback(
    async (query: string) => {
      setEmailQuery(query)
      if (query.trim().length < 2) {
        setSearchResults([])
        return
      }
      setIsSearching(true)
      try {
        const res = await userApi.searchByEmail(query.trim())
        setSearchResults(Array.isArray(res.data) ? res.data : [])
      } catch {
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    },
    []
  )

  const handleAddStudentToClass = (userId: number) => {
    if (!studentClass) return
    assignStudentMutation.mutate({ classId: studentClass.class_id, studentIds: [userId] })
  }

  const openEditModal = (cls: ClassItem) => {
    setEditingClass(cls)
    setClassForm({
      class_name: cls.class_name,
      teacher_id: cls.teacher_id ? String(cls.teacher_id) : ''
    })
  }

  const openAddStudentModal = (cls: ClassItem) => {
    setStudentClass(cls)
    setEmailQuery('')
    setSearchResults([])
  }

  return (
    <div>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-slate-900'>Quản lý Lớp học</h2>
          <p className='mt-1 text-sm text-slate-500'>Giáo viên quản lý lớp của mình, admin quản lý toàn bộ.</p>
        </div>
        <button
          onClick={() => {
            setClassForm(defaultClassForm)
            setOpenCreateClassModal(true)
          }}
          className='flex items-center gap-2 rounded-2xl bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-400 shadow-lg shadow-pink-200'
        >
          <FiPlusCircle /> Tạo lớp mới
        </button>
      </div>

      <div className='mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <SearchInput
          placeholder='Tìm tên lớp...'
          value={searchTerm}
          onChange={(val) => { setSearchTerm(val); setPage(1); }}
        />
        <div className='flex items-center rounded-2xl border border-pink-100 bg-pink-50/50 px-4 py-2.5 text-sm text-slate-600 font-medium'>
          Tổng cộng: <span className='ml-1 font-bold text-pink-600'>{pagination?.total || 0}</span> lớp học
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
                  <th className='px-6 py-4 text-center'>ID</th>
                  <th className='px-6 py-4'>Tên lớp học</th>
                  <th className='px-6 py-4'>Giáo viên phụ trách</th>
                  <th className='px-6 py-4 text-center'>Sĩ số</th>
                  <th className='px-6 py-4 text-right'>Thao tác</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-pink-50'>
                {classes.map((cls) => (
                  <tr key={cls.class_id} className='transition hover:bg-pink-50/20'>
                    <td className='px-6 py-4 text-center font-medium text-slate-500'>{cls.class_id}</td>
                    <td className='px-6 py-4 font-bold text-slate-900'>{cls.class_name}</td>
                    <td className='px-6 py-4 text-slate-600 font-medium'>{cls.teacher_name || 'Chưa phân công'}</td>
                    <td className='px-6 py-4 text-center'>
                      <span className='rounded-full bg-pink-100 px-3 py-1 text-[10px] font-black uppercase text-pink-600'>
                        {cls.student_count} HS
                      </span>
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <div className='flex justify-end gap-2'>
                        <button
                          onClick={() => openAddStudentModal(cls)}
                          className='rounded-xl border border-pink-100 p-2 text-pink-400 transition hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200'
                          title='Thêm học sinh'
                        >
                          <FiUserPlus size={18} />
                        </button>
                        <button
                          onClick={() => openEditModal(cls)}
                          className='rounded-xl border border-sky-100 p-2 text-sky-400 transition hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200'
                          title='Sửa lớp'
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Xóa lớp ${cls.class_name}?`)) {
                              deleteClassMutation.mutate(cls.class_id)
                            }
                          }}
                          className='rounded-xl border border-rose-100 p-2 text-rose-400 transition hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                          title='Xoá lớp'
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {classes.length === 0 && (
                  <tr>
                    <td colSpan={5} className='py-20 text-center text-slate-400 font-medium'>
                      Không tìm thấy lớp học nào
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

      {/* Modals... (omitted for brevity in this replace but I'll keep them in the file) */}
      {(openCreateClassModal || editingClass) && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl'>
            <h3 className='text-xl font-bold text-slate-900'>{editingClass ? 'Sửa lớp học' : 'Tạo lớp học mới'}</h3>

            <div className='mt-6 space-y-4'>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-slate-700'>Tên lớp học</label>
                <input
                  value={classForm.class_name}
                  onChange={(e) => setClassForm((prev) => ({ ...prev, class_name: e.target.value }))}
                  className='w-full rounded-2xl border border-pink-200 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition'
                  placeholder='VD: ReactJS K18'
                />
              </div>

              {isAdmin && (
                <div>
                  <label className='mb-1.5 block text-sm font-medium text-slate-700'>
                    Giáo viên phụ trách
                  </label>
                  <select
                    value={classForm.teacher_id}
                    onChange={(e) => setClassForm((prev) => ({ ...prev, teacher_id: e.target.value }))}
                    className='w-full rounded-2xl border border-pink-200 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition appearance-none bg-white'
                  >
                    <option value=''>-- Chọn giáo viên --</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.user_id} value={teacher.user_id}>
                        {teacherLabelById.get(teacher.user_id)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className='mt-8 flex justify-end gap-3'>
              <button
                onClick={() => {
                  setOpenCreateClassModal(false)
                  setEditingClass(null)
                }}
                className='rounded-2xl border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition'
              >
                Huỷ
              </button>
              <button
                onClick={editingClass ? submitUpdateClass : submitCreateClass}
                disabled={createClassMutation.isPending || updateClassMutation.isPending}
                className='rounded-2xl bg-pink-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-pink-400 disabled:opacity-60 transition shadow-lg shadow-pink-200'
              >
                {editingClass ? 'Lưu thay đổi' : 'Tạo lớp ngay'}
              </button>
            </div>
          </div>
        </div>
      )}

      {studentClass && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl'>
            <div className='flex items-center justify-between'>
               <h3 className='text-xl font-bold text-slate-900'>
                Thêm học sinh vào lớp
              </h3>
              <span className='rounded-lg bg-pink-100 px-3 py-1 text-sm font-bold text-pink-600'>{studentClass.class_name}</span>
            </div>
            <p className='mt-2 text-sm text-slate-500'>
              Tìm kiếm tài khoản bằng email để gán vào lớp này.
            </p>

            <div className='mt-6'>
               <SearchInput
                  value={emailQuery}
                  onChange={handleSearchEmail}
                  placeholder='Nhập email học sinh...'
                  autoFocus
                />
            </div>

            {isSearching && (
              <div className='mt-6 flex items-center justify-center gap-2 text-sm text-slate-400'>
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-pink-500 border-t-transparent'></div>
                Đang tìm kiếm...
              </div>
            )}

            {searchResults.length > 0 && (
              <div className='mt-6 max-h-64 space-y-3 overflow-y-auto pr-2 custom-scrollbar'>
                {searchResults.map((u) => (
                  <div
                    key={u.user_id}
                    className='group flex items-center justify-between rounded-2xl border border-pink-50 bg-pink-50/30 p-4 transition hover:bg-pink-50 hover:border-pink-200'
                  >
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-bold text-slate-900'>{u.full_name}</p>
                      <p className='truncate text-xs text-slate-500 font-medium'>
                        {u.email}
                      </p>
                      <div className='mt-1 flex flex-wrap gap-2'>
                        <span className='text-[10px] font-bold uppercase text-pink-400 tracking-wider'>{u.user_code || 'No Code'}</span>
                        {u.class_id && (
                          <span className='rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold uppercase text-sky-600'>
                            Lớp #{u.class_id}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddStudentToClass(u.user_id)}
                      disabled={assignStudentMutation.isPending}
                      className='ml-4 shrink-0 rounded-xl bg-pink-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-pink-400 disabled:opacity-60 shadow-md shadow-pink-100'
                    >
                      Thêm
                    </button>
                  </div>
                ))}
              </div>
            )}

            {emailQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
              <div className='mt-8 rounded-2xl border border-dashed border-slate-200 p-6 text-center'>
                <p className='text-sm text-slate-400'>Không tìm thấy người dùng nào khớp với email này.</p>
              </div>
            )}

            <div className='mt-8 flex justify-end'>
              <button
                onClick={() => setStudentClass(null)}
                className='rounded-2xl border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition'
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
