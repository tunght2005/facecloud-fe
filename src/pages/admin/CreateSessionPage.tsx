import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createSessionSchema } from '~/utils/schemas'
import attendanceApi from '~/apis/attendance.api'
import classApi from '~/apis/class.api'
import PATHS from '~/constants/paths'

export default function CreateSessionPage() {
  const navigate = useNavigate()

  const { data: classesData } = useQuery({
    queryKey: ['classes'],
    queryFn: () => classApi.getAll()
  })
  const classes = (Array.isArray(classesData?.data?.data) ? classesData.data.data : []) as any[]

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createSessionSchema)
  })

  const mutation = useMutation({
    mutationFn: attendanceApi.createSession,
    onSuccess: () => {
      toast.success('Tạo buổi điểm danh thành công!')
      navigate(PATHS.ADMIN_ATTENDANCE)
    }
  })

  const inputClass =
    'w-full rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 text-slate-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20'

  const onSubmit = (data: any) => {
    mutation.mutate(data)
  }

  return (
    <div className='mx-auto max-w-lg'>
      <h2 className='mb-6 text-2xl font-bold text-slate-900'>Tạo buổi điểm danh</h2>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <label className='mb-1.5 block text-sm font-medium text-slate-700'>Lớp học</label>
          <select {...register('class_id')} className={inputClass}>
            <option value=''>-- Chọn lớp --</option>
            {classes.map((cls) => (
              <option key={cls.class_id} value={cls.class_id}>
                {cls.class_name}
              </option>
            ))}
          </select>
          {errors.class_id && <p className='mt-1 text-sm text-rose-500'>{errors.class_id.message}</p>}
        </div>

        <div>
          <label className='mb-1.5 block text-sm font-medium text-slate-700'>Ngày điểm danh</label>
          <input {...register('session_date')} type='date' className={inputClass} />
          {errors.session_date && <p className='mt-1 text-sm text-rose-500'>{errors.session_date.message}</p>}
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='mb-1.5 block text-sm font-medium text-slate-700'>Giờ bắt đầu</label>
            <input {...register('start_time')} type='time' className={inputClass} />
            {errors.start_time && <p className='mt-1 text-sm text-rose-500'>{errors.start_time.message}</p>}
          </div>
          <div>
            <label className='mb-1.5 block text-sm font-medium text-slate-700'>Giờ kết thúc</label>
            <input {...register('end_time')} type='time' className={inputClass} />
            {errors.end_time && <p className='mt-1 text-sm text-rose-500'>{errors.end_time.message}</p>}
          </div>
        </div>

        <div className='flex gap-3 pt-2'>
          <button
            type='submit'
            disabled={mutation.isPending}
            className='flex-1 rounded-2xl bg-pink-500 py-3 text-sm font-semibold text-white transition hover:bg-pink-400 disabled:opacity-60'
          >
            {mutation.isPending ? 'Đang tạo...' : 'Tạo buổi điểm danh'}
          </button>
          <button
            type='button'
            onClick={() => navigate(PATHS.ADMIN_ATTENDANCE)}
            className='rounded-2xl border border-pink-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-pink-50'
          >
            Huỷ
          </button>
        </div>
      </form>
    </div>
  )
}
