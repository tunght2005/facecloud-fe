import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createClassSchema } from '~/utils/schemas'
import classApi from '~/apis/class.api'
import userApi from '~/apis/user.api'
import PATHS from '~/constants/paths'
import { useApp } from '~/contexts/app.context'

export default function CreateClassPage() {
  const navigate = useNavigate()
  const { roles } = useApp()
  const isAdmin = roles.includes('admin')

  const { data: teachersRes } = useQuery({
    queryKey: ['teachers-options'],
    enabled: isAdmin,
    queryFn: () => userApi.getTeachers()
  })
  const teachers = Array.isArray(teachersRes?.data) ? teachersRes.data : []

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createClassSchema)
  })

  const mutation = useMutation({
    mutationFn: classApi.create,
    onSuccess: () => {
      toast.success('Tạo lớp học thành công!')
      navigate(PATHS.ADMIN_CLASSES)
    }
  })

  const inputClass =
    'w-full rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 text-slate-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20'

  const onSubmit = (data: any) => {
    mutation.mutate(data)
  }

  return (
    <div className='mx-auto max-w-lg'>
      <h2 className='mb-6 text-2xl font-bold text-slate-900'>Tạo lớp học mới</h2>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <label className='mb-1.5 block text-sm font-medium text-slate-700'>Tên lớp</label>
          <input {...register('class_name')} placeholder='Lớp ReactJS K1' className={inputClass} />
          {errors.class_name && <p className='mt-1 text-sm text-rose-500'>{errors.class_name.message}</p>}
        </div>

        {isAdmin && (
          <div>
            <label className='mb-1.5 block text-sm font-medium text-slate-700'>Giáo viên phụ trách (tuỳ chọn)</label>
            <select {...register('teacher_id')} className={inputClass}>
              <option value=''>-- Chọn giáo viên --</option>
              {teachers.map((teacher) => (
                <option key={teacher.user_id} value={teacher.user_id}>
                  {teacher.full_name} ({teacher.user_code || teacher.email})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className='flex gap-3 pt-2'>
          <button
            type='submit'
            disabled={mutation.isPending}
            className='flex-1 rounded-2xl bg-pink-500 py-3 text-sm font-semibold text-white transition hover:bg-pink-400 disabled:opacity-60'
          >
            {mutation.isPending ? 'Đang tạo...' : 'Tạo lớp học'}
          </button>
          <button
            type='button'
            onClick={() => navigate(PATHS.ADMIN_CLASSES)}
            className='rounded-2xl border border-pink-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-pink-50'
          >
            Huỷ
          </button>
        </div>
      </form>
    </div>
  )
}
