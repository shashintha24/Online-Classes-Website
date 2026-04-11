import { Link } from 'react-router-dom'
import Header from '../components/header/Header'

const partners = ['Microsoft', 'Cisco', 'VMware', 'Samsung', 'Vimeo', 'P&G', 'Hewlett Packard']

const tabs = ['Python', 'Web Development', 'Data Science', 'IT Certifications', 'Leadership']

const featuredCourses = [
  {
    title: 'The Complete Full-Stack Web Development Bootcamp',
    author: 'Angela Yu',
    rating: '4.7',
    learners: '412,932',
    price: '$16.99',
    original: '$89.99',
    tag: 'Bestseller',
  },
  {
    title: 'Python for Data Science and Machine Learning',
    author: 'Jose Portilla',
    rating: '4.6',
    learners: '265,110',
    price: '$13.99',
    original: '$79.99',
    tag: 'Hot and New',
  },
  {
    title: 'AWS Certified Cloud Practitioner Crash Course',
    author: 'Neal Davis',
    rating: '4.8',
    learners: '153,009',
    price: '$14.99',
    original: '$84.99',
    tag: 'Updated 2026',
  },
  {
    title: 'Productivity and Focus Mastery for Creators',
    author: 'Ali Abdaal',
    rating: '4.5',
    learners: '89,430',
    price: '$11.99',
    original: '$59.99',
    tag: 'Popular',
  },
]

const learningGoals = [
  {
    title: 'Hands-on practice',
    text: 'Apply concepts with quizzes, coding exercises, and assignments built into every module.',
  },
  {
    title: 'Learn from experts',
    text: 'Top instructors share practical workflows, not just theory, so you can ship real work faster.',
  },
  {
    title: 'Career-ready skills',
    text: 'Follow industry-focused learning paths and build a portfolio that stands out in interviews.',
  },
  {
    title: 'Learn at your pace',
    text: 'Lifetime access and mobile learning let you revisit lessons when and where you need them.',
  },
]

const testimonials = [
  {
    quote:
      'I switched careers in 6 months. The path from beginner web modules to portfolio projects was exactly what I needed.',
    name: 'Maria R.',
    role: 'Frontend Developer',
  },
  {
    quote:
      'The practical exercises are the best part. Every course pushed me to build and apply instead of just watch.',
    name: 'Daniel K.',
    role: 'Cloud Engineer',
  },
]

function HomePage() {
  return (
    <main className="site-shell">
      <Header />

      <section className="hero container">
        <article className="hero-card">
          <p className="eyebrow">Lowest price of the season</p>
          <h1>Skills that move your career forward</h1>
          <p>
            Technology and business courses trusted by teams and learners around the world. Learn
            once, use forever.
          </p>
          <div className="hero-cta">
            <Link to="/courses" className="btn btn-dark">
              Explore courses
            </Link>
            <Link to="/register" className="btn btn-outline">
              Try personal plan
            </Link>
          </div>
        </article>
        <aside className="hero-highlights">
          <h3>What you get</h3>
          <ul className="simple-list">
            <li>
              <span>27,000+</span>
              <span>expert-led courses</span>
            </li>
            <li>
              <span>4.7/5</span>
              <span>average learner rating</span>
            </li>
            <li>
              <span>Lifetime</span>
              <span>access on mobile and desktop</span>
            </li>
          </ul>
        </aside>
      </section>

      <section className="container trusted-strip">
        <p className="muted">Trusted by over 16,000 companies and millions of learners worldwide</p>
        <div className="brand-row" aria-label="Trusted companies">
          {partners.map((partner) => (
            <span key={partner}>{partner}</span>
          ))}
        </div>
      </section>

      <section className="container tabs-block">
        <div className="section-head">
          <h2>A broad selection of courses</h2>
          <p>Choose from in-demand skills and learn from instructors with real-world experience.</p>
        </div>
        <div className="topic-tabs">
          {tabs.map((tab, index) => (
            <button key={tab} className={index === 0 ? 'tab active' : 'tab'} type="button">
              {tab}
            </button>
          ))}
        </div>
      </section>

      <section className="container course-grid">
        {featuredCourses.map((course) => (
          <article key={course.title} className="course-card">
            <div className="thumb" aria-hidden="true" />
            <span className="pill">{course.tag}</span>
            <h3>{course.title}</h3>
            <p className="author">{course.author}</p>
            <p className="rating">
              {course.rating} rating | {course.learners} learners
            </p>
            <p className="price-row">
              <strong>{course.price}</strong> <span>{course.original}</span>
            </p>
          </article>
        ))}
      </section>

      <section className="features container">
        <div className="section-head">
          <h2>All the skills you need in one place</h2>
        </div>
        <div className="feature-grid">
          {learningGoals.map((goal) => (
            <article key={goal.title} className="feature-card">
              <h3>{goal.title}</h3>
              <p>{goal.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container testimonial-grid">
        {testimonials.map((item) => (
          <article className="testimonial" key={item.name}>
            <p>{item.quote}</p>
            <h4>{item.name}</h4>
            <span>{item.role}</span>
          </article>
        ))}
      </section>

      <section className="container cta-strip">
        <div>
          <p className="eyebrow">Become an instructor</p>
          <h2>Share your expertise with the world</h2>
          <p>
            Teach what you love and help learners build practical, job-ready skills with high-impact
            content.
          </p>
        </div>
        <Link to="/admin" className="btn btn-dark">
          Start teaching today
        </Link>
      </section>

      <footer className="site-footer">
        <div className="container footer-row">
          <p>LearnHub 2026. Knowledge without boundaries.</p>
          <div className="footer-links">
            <Link to="/courses">Courses</Link>
            <Link to="/dashboard">My Learning</Link>
            <Link to="/admin">Teach</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default HomePage