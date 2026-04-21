import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createUserSchema } from '~/utils/schemas'
import userApi from '~/apis/user.api'
import classApi from '~/apis/class.api'
import PATHS from '~/constants/paths'

const generateUserCode = (role: string) => {
  const prefix = role === 'admin' ? 'AD' : role === 'teacher' ? 'GV' : 'SV'
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}${random}`
}

export default function CreateUserPage() {
  const navigate = useNavigate()
  const { data: classesRes } = useQuery({
    queryKey: ['classes-options-create-user'],
    queryFn: () => classApi.getAll()
  })
  const classes = Array.isArray(classesRes?.data?.data) ? classesRes.data.data : []

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role_name: 'student', user_code: generateUserCode('student') }
  })

  const selectedRole = watch('role_name')

  const mutation = useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      toast.success('Tạo người dùng thành công!')
      navigate(PATHS.ADMIN_USERS)
    }
  })

  const inputClass =
    'w-full rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 text-slate-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20'

  const onSubmit = (data: any) => {
    mutation.mutate(data)
  }

  const handleRandomCode = () => {
    setValue('user_code', generateUserCode(selectedRole))
  }

  return (
    <div className='mx-auto max-w-lg'>
      <h2 className='mb-6 text-2xl font-bold text-slate-900'>Thêm người dùng mới</h2>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <label className='mb-1.5 block text-sm font-medium text-slate-700'>Họ tên</label>
          <input {...register('full_name')} placeholder='Nguyễn Văn A' className={inputClass} />
          {errors.full_name && <p className='mt-1 text-sm text-rose-500'>{errors.full_name.message}</p>}
        </div>

        <div>
          <label className='mb-1.5 block text-sm font-medium text-slate-700'>Mã người dùng</label>
          <div className='flex gap-2'>
            <input {...register('user_code')} placeholder='SV001 / GV001' className={inputClass} />
            <button
              type='button'
              onClick={handleRandomCode}
              className='shrink-0 rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm font-medium text-pink-600 transition hover:bg-pink-50'
            >
              🎲 Random
            </button>
          </div>
          {errors.user_code && <p className='mt-1 text-sm text-rose-500'>{errors.user_code.message}</p>}
        </div>

        <div>
          <label className='mb-1.5 block text-sm font-medium text-slate-700'>Email</label>
          <input {...register('email')} type='email' placeholder='email@example.com' className={inputClass} />
          {errors.email && <p className='mt-1 text-sm text-rose-500'>{errors.email.message}</p>}
        </div>

        <div>
          <label className='mb-1.5 block text-sm font-medium text-slate-700'>Mật khẩu</label>
          <input {...register('password')} type='password' placeholder='••••••••' className={inputClass} />
          {errors.password && <p className='mt-1 text-sm text-rose-500'>{errors.password.message}</p>}
        </div>

        <div>
          <label className='mb-1.5 block text-sm font-medium text-slate-700'>Vai trò</label>
          <select
            {...register('role_name')}
            className={inputClass}
            onChange={(e) => {
              const role = e.target.value
              setValue('role_name', role)
              setValue('user_code', generateUserCode(role))
            }}
          >
            <option value='student'>Học sinh</option>
            <option value='teacher'>Giáo viên</option>
            <option value='admin'>Quản trị viên</option>
          </select>
        </div>

        <div>
          <label className='mb-1.5 block text-sm font-medium text-slate-700'>Lớp (tuỳ chọn)</label>
          <select {...register('class_id')} className={inputClass}>
            <option value=''>-- Chọn lớp --</option>
            {classes.map((cls) => (
              <option key={cls.class_id} value={cls.class_id}>
                {cls.class_name}
              </option>
            ))}
          </select>
        </div>

        <div className='flex gap-3 pt-2'>
          <button
            type='submit'
            disabled={mutation.isPending}
            className='flex-1 rounded-2xl bg-pink-500 py-3 text-sm font-semibold text-white transition hover:bg-pink-400 disabled:opacity-60'
          >
            {mutation.isPending ? 'Đang tạo...' : 'Tạo người dùng'}
          </button>
          <button
            type='button'
            onClick={() => navigate(PATHS.ADMIN_USERS)}
            className='rounded-2xl border border-pink-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-pink-50'
          >
            Huỷ
          </button>
        </div>
      </form>
    </div>
  )
}
