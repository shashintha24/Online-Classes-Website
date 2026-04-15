import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const THEMES = {
  light: {
    page: 'bg-[#f7f9fa] text-gray-900',
    card: 'bg-white border border-[#e0e0e0]',
    sub: 'text-gray-500',
    tiny: 'text-gray-400',
    primaryBtn: 'bg-[#a435f0] hover:bg-[#8710d8] text-white',
    secondaryBtn: 'bg-white border border-[#d1d5db] text-gray-700 hover:bg-gray-50',
    link: 'text-[#3c3489] hover:text-[#a435f0]',
    ring: 'ring-[#a435f0]/20',
  },
  dark: {
    page: 'bg-[#1c1d1f] text-gray-100',
    card: 'bg-[#2d2f31] border border-[#3e4143]',
    sub: 'text-gray-400',
    tiny: 'text-gray-500',
    primaryBtn: 'bg-[#a435f0] hover:bg-[#8710d8] text-white',
    secondaryBtn: 'bg-[#3e4143] border border-[#555] text-gray-200 hover:bg-[#4a4d50]',
    link: 'text-[#a5b4fc] hover:text-[#c4b5fd]',
    ring: 'ring-[#a5b4fc]/20',
  },
}

function NotFoundPage() {
  const navigate = useNavigate()
  const [secondsLeft, setSecondsLeft] = useState(5)
  const [darkMode, setDarkMode] = useState(false)
  const t = darkMode ? THEMES.dark : THEMES.light

  useEffect(() => {
    const countdownId = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    const redirectId = setTimeout(() => {
      navigate('/')
    }, 5000)

    return () => {
      clearInterval(countdownId)
      clearTimeout(redirectId)
    }
  }, [navigate])

  return (
    <main className={`min-h-screen relative overflow-hidden ${t.page}`}>
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#a435f0]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <section className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className={`w-full max-w-xl rounded-2xl p-6 md:p-8 shadow-xl ring-1 ${t.card} ${t.ring}`}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#a435f0]">Error 404</p>
            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${t.secondaryBtn}`}
            >
              {darkMode ? 'Light Theme' : 'Dark Theme'}
            </button>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold">Page not found</h1>
          <p className={`mt-3 ${t.sub}`}>
            The page you requested does not exist, was moved, or the link is outdated.
            Try one of the pages below.
          </p>
          <p className={`mt-2 text-sm ${t.tiny}`}>Redirecting to home in {secondsLeft}s...</p>

          <ul className="mt-6 divide-y divide-[#00000014]" aria-label="Quick links">
            <li className="py-2.5 flex items-center justify-between gap-3">
              <span className={t.sub}>Student portal</span>
              <Link className={`text-sm font-semibold ${t.link}`} to="/student">Open</Link>
            </li>
            <li className="py-2.5 flex items-center justify-between gap-3">
              <span className={t.sub}>Teacher portal</span>
              <Link className={`text-sm font-semibold ${t.link}`} to="/tuition">Open</Link>
            </li>
            <li className="py-2.5 flex items-center justify-between gap-3">
              <span className={t.sub}>Sign in</span>
              <Link className={`text-sm font-semibold ${t.link}`} to="/login">Open</Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  )
}

export default NotFoundPage