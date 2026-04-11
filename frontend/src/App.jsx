import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import AdminPage from './pages/AdminPage'
import CoursePage from './pages/CoursePage'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import RegisterPage from './pages/RegisterPage'
import Studentpage from './pages/StudentPortal'
import Manegement from './pages/TuitionPlatform'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/not-found" element={<NotFoundPage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/student" element={<Studentpage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/management" element={<Manegement />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
