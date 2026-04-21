export type User = {
  id: string
  name: string
  email: string
  role: 'student' | 'teacher'
  avatarUrl: string
  className?: string
  subject?: string
  homeRoom?: string
  supervisor?: string
}
