import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import RegisterPage from './pages/RegisterPage'
import Studentpage from './pages/StudentPortal'
import Manegement from './pages/TuitionPlatform'
import LandingPage from './pages/EduTrackLanding'

function App() {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/not-found" element={<NotFoundPage />} />
        <Route path="/student" element={<Studentpage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/management" element={<Manegement />} />
        <Route path="/tuition" element={<Manegement />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
