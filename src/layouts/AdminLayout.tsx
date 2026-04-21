import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import PATHS from '../constants/paths'

import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

import TeacherPage from '../pages/TeacherAdmin'
import StudentPage from '../pages/StudentAdmin'
import ClassPage from '../pages/ClassAdmin'

import AddStudentPage from '../pages/AddStudent'
import EditStudentPage from '../pages/EditStudent'

import AddTeacherPage from '../pages/AddTeacher'
import EditTeacherPage from '../pages/EditTeacher'

export default function AdminLayout() {
  const [page, setPage] = useState('student')

  const [isLogin] = useState(
    localStorage.getItem('isLogin') === 'true'
  )

  const [role] = useState(
    localStorage.getItem('role') || ''
  )

  // ===== STUDENT =====
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Nguyen Van A',
      email: 'a@gmail.com',
      password: '123456',
      class: 'CTK42',
    },
  ])

  const [selectedStudent, setSelectedStudent] = useState<any>(null)

  const handleAddStudent = (student: any) => {
    setStudents((prev) => [...prev, { ...student, id: Date.now() }])
  }

  const handleUpdateStudent = (updated: any) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    )
  }

  const handleDeleteStudent = (id: number) => {
    if (!confirm('Xoá student?')) return
    setStudents((prev) => prev.filter((s) => s.id !== id))
  }

  // ===== TEACHER =====
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: 'Le Van C',
      email: 'c@gmail.com',
      password: '123456',
      class: 'CTK42',
    },
  ])

  const [selectedTeacher, setSelectedTeacher] = useState<any>(null)

  const handleAddTeacher = (teacher: any) => {
    setTeachers((prev) => [...prev, { ...teacher, id: Date.now() }])
  }

  const handleUpdateTeacher = (updated: any) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    )
  }

  const handleDeleteTeacher = (id: number) => {
    if (!confirm('Xoá teacher?')) return
    setTeachers((prev) => prev.filter((t) => t.id !== id))
  }

  // ===== AUTH =====
  const handleLogout = () => {
    localStorage.clear()
    window.location.href = PATHS.LOGIN
  }

  // ===== RENDER =====
  if (!isLogin) {
    return <Navigate to={PATHS.LOGIN} replace />
  }

  if (role === 'student') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <div className="rounded-3xl border border-pink-200 bg-white p-10 text-center shadow-xl shadow-pink-200/30">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-pink-100">
            <svg className="h-10 w-10 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Bạn không có quyền vào Admin</h2>
          <p className="mt-3 text-slate-500">Vui lòng liên hệ quản trị viên để được hỗ trợ.</p>
          <button
            onClick={handleLogout}
            className="mt-6 rounded-2xl bg-pink-500 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-pink-400 hover:shadow-lg hover:shadow-pink-200/50"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    )
  }

  const renderPage = () => {
    switch (page) {
      case 'student':
        return (
          <StudentPage
            students={students}
            goToAdd={() => setPage('add-student')}
            onEdit={(s) => {
              setSelectedStudent(s)
              setPage('edit-student')
            }}
            onDelete={handleDeleteStudent}
          />
        )

      case 'add-student':
        return (
          <AddStudentPage
            onAdd={handleAddStudent}
            goBack={() => setPage('student')}
          />
        )

      case 'edit-student':
        return (
          <EditStudentPage
            student={selectedStudent}
            onUpdate={handleUpdateStudent}
            goBack={() => setPage('student')}
          />
        )

      case 'teacher':
        return role === 'admin' ? (
          <TeacherPage
            teachers={teachers}
            goToAdd={() => setPage('add-teacher')}
            onEdit={(t) => {
              setSelectedTeacher(t)
              setPage('edit-teacher')
            }}
            onDelete={handleDeleteTeacher}
          />
        ) : null

      case 'add-teacher':
        return (
          <AddTeacherPage
            onAdd={handleAddTeacher}
            goBack={() => setPage('teacher')}
          />
        )

      case 'edit-teacher':
        return (
          <EditTeacherPage
            teacher={selectedTeacher}
            onUpdate={handleUpdateTeacher}
            goBack={() => setPage('teacher')}
          />
        )

      case 'class':
        return role === 'admin' ? <ClassPage /> : null

      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen bg-pink-50">
      <Sidebar setPage={setPage} role={role} currentPage={page} />

      <div className="flex flex-1 flex-col">
        <Header onLogout={handleLogout} />

        <main className="flex-1 p-6">
          <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-lg shadow-pink-100/50">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  )
}
