import { z } from 'zod'

const optionalNumberFromInput = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) {
    return undefined
  }
  return Number(value)
}, z.number().int().positive().optional())

export const loginSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  full_name: z.string().min(1, 'Họ tên là bắt buộc'),
  user_code: z.string().min(1, 'Mã người dùng là bắt buộc')
})

export type RegisterFormData = z.infer<typeof registerSchema>

export const createUserSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  full_name: z.string().min(1, 'Họ tên là bắt buộc'),
  user_code: z.string().min(1, 'Mã người dùng là bắt buộc'),
  class_id: optionalNumberFromInput,
  role_name: z.string().min(1, 'Vai trò là bắt buộc')
})

export type CreateUserFormData = z.infer<typeof createUserSchema>

export const updateUserSchema = z.object({
  full_name: z.string().min(1, 'Họ tên là bắt buộc').optional(),
  class_id: optionalNumberFromInput,
  user_status: z.string().optional()
})

export type UpdateUserFormData = z.infer<typeof updateUserSchema>

export const createClassSchema = z.object({
  class_name: z.string().min(1, 'Tên lớp là bắt buộc'),
  teacher_id: optionalNumberFromInput,
  student_ids: z.array(z.coerce.number()).optional()
})

export type CreateClassFormData = z.infer<typeof createClassSchema>

export const createSessionSchema = z.object({
  class_id: z.coerce.number().min(1, 'Lớp học là bắt buộc'),
  session_date: z.string().min(1, 'Ngày điểm danh là bắt buộc'),
  start_time: z.string().min(1, 'Giờ bắt đầu là bắt buộc'),
  end_time: z.string().min(1, 'Giờ kết thúc là bắt buộc')
})

export type CreateSessionFormData = z.infer<typeof createSessionSchema>
