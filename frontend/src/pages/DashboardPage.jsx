import { Link } from 'react-router-dom'
import Header from '../components/header/Header'

const upcoming = [
  { className: 'Python Foundations', time: 'Today, 6:00 PM' },
  { className: 'UI Design Critique', time: 'Tomorrow, 4:30 PM' },
  { className: 'Node.js Lab Session', time: 'Friday, 8:00 PM' },
]

function DashboardPage() {
  return (
    
    <main className="site-shell">
      <Header />
      <section className="container page-head">
        <p className="eyebrow">STUDENT DASHBOARD</p>
        <h1>Track your progress and next classes</h1>
      </section>

      <section className="container dashboard-grid">
        <article className="dashboard-card">
          <h3>This Week</h3>
          <p>3 classes attended</p>
          <p>2 assignments submitted</p>
          <p>Average score: 87%</p>
        </article>

        <article className="dashboard-card">
          <h3>Upcoming Live Classes</h3>
          <ul className="simple-list">
            {upcoming.map((item) => (
              <li key={item.className}>
                <span>{item.className}</span>
                <span>{item.time}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="container back-row">
        <Link to="/courses" className="btn btn-outline">
          Explore More Courses
        </Link>
      </section>
    </main>
  )
}

export default DashboardPage