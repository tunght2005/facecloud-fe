import { useState, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import FaceScanPage from './pages/FaceScanPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'

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

function ProtectedRoute({ user, children }: { user: User | null; children: ReactNode }) {
  if (!user) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

function App() {
  const [user, setUser] = useState<User | null>(null)

  const handleLogin = (userData: User) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user!} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <ProfilePage user={user!} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/face-scan"
          element={
            <ProtectedRoute user={user}>
              <FaceScanPage user={user!} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
