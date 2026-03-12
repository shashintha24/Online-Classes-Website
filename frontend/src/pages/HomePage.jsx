import { Link } from 'react-router-dom'
import Header from '../components/header/Header'

const highlights = [
  { label: 'Active Learners', value: '42K+' },
  { label: 'Live Classes Weekly', value: '1,200+' },
  { label: 'Course Completion Rate', value: '91%' },
]

const featureCards = [
  {
    title: 'Live Interactive Classes',
    text: 'Host high-energy sessions with chat, polls, and instant doubt support for students.',
  },
  {
    title: 'Structured Learning Paths',
    text: 'Bundle courses into guided tracks so students progress from basics to advanced topics.',
  },
  {
    title: 'Performance Analytics',
    text: 'Track engagement, quiz scores, and drop-off points to improve outcomes each week.',
  },
]

function HomePage() {
  return (
    <main className="site-shell">
      <Header />

      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">MODERN E-CLASS PLATFORM</p>
          <h2>Build a high-impact online classroom in days, not months.</h2>
          <p>
            Create courses, run live classes, manage assignments, and monitor progress from one
            clean dashboard for teachers and students.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary">
              Create Classroom
            </Link>
            <Link to="/courses" className="btn btn-outline">
              Browse Courses
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <p className="panel-title">Upcoming Live Class</p>
          <h3>React for Beginners</h3>
          <ul>
            <li>Today • 7:30 PM</li>
            <li>Instructor: Sarah Ahmed</li>
            <li>128 students enrolled</li>
          </ul>
        </div>
      </section>

      <section className="stats container">
        {highlights.map((item) => (
          <article key={item.label} className="stat-card">
            <p className="stat-value">{item.value}</p>
            <p className="stat-label">{item.label}</p>
          </article>
        ))}
      </section>

      <section className="features container">
        <div className="section-head">
          <p className="eyebrow">WHY EDPULSE</p>
          <h3>Everything your e-class platform needs</h3>
        </div>
        <div className="feature-grid">
          {featureCards.map((feature) => (
            <article key={feature.title} className="feature-card">
              <h4>{feature.title}</h4>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default HomePage