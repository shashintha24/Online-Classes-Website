import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './components/auth/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import SignupPage from './components/auth/Signup'
import Studentpage from './pages/Student/StudentPortal'
import Manegement from './pages/Teacher/TuitionPortal'
import AdminPortal from './pages/Admin/AdminPortal'
import LandingPage from './pages/ElectroPhysicsLanding'

function getStoredAuth() {
  try {
    const raw = sessionStorage.getItem('ep_auth')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function RoleRoute({ allow, element }) {
  const auth = getStoredAuth()
  if (!auth?.role) {
    return <Navigate to="/login" replace />
  }
  if (!allow.includes(auth.role)) {
    return <Navigate to="/not-found" replace />
  }
  return element
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/not-found" element={<NotFoundPage />} />
        <Route path="/student" element={<RoleRoute allow={["STUDENT"]} element={<Studentpage />} />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/management" element={<RoleRoute allow={["ADMIN", "TEACHER"]} element={<Manegement />} />} />
        <Route path="/admin" element={<RoleRoute allow={["ADMIN", "TEACHER"]} element={<AdminPortal />} />} />
        <Route path="/tuition" element={<RoleRoute allow={["ADMIN", "TEACHER"]} element={<Manegement />} />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
