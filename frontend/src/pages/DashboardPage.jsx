import { Link } from 'react-router-dom'
import Header from '../components/header/Header'

const upcoming = [
  { className: 'System Design for Product Engineers', time: 'Today, 6:00 PM' },
  { className: 'Advanced SQL Query Practice', time: 'Tomorrow, 4:30 PM' },
  { className: 'Cloud Security Fundamentals', time: 'Friday, 8:00 PM' },
]

function DashboardPage() {
  return (
    <main className="site-shell">
      <Header />
      <section className="container page-head">
        <p className="eyebrow">My learning</p>
        <h1>Welcome back, keep your streak alive</h1>
      </section>

      <section className="container dashboard-grid">
        <article className="dashboard-card">
          <h3>Weekly snapshot</h3>
          <p>4 modules completed</p>
          <p>2 practice projects submitted</p>
          <p>Average quiz score: 91%</p>
        </article>

        <article className="dashboard-card">
          <h3>Upcoming live sessions</h3>
          <ul className="simple-list">
            {upcoming.map((item) => (
              <li key={item.className}>
                <span>{item.className}</span>
                <span>{item.time}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="dashboard-card">
          <h3>Continue watching</h3>
          <p>Modern React Architecture</p>
          <p className="muted">Lesson 18 of 52 | 43% complete</p>
          <button className="btn btn-dark" type="button">
            Resume learning
          </button>
        </article>
      </section>

      <section className="container back-row">
        <Link to="/courses" className="btn btn-outline">
          Discover more courses
        </Link>
      </section>
    </main>
  )
}

export default DashboardPage