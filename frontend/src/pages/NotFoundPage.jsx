import { Link } from 'react-router-dom'
import Header from '../components/header/Header'

function NotFoundPage() {
  return (
    <main className="site-shell">
      <Header />
      <section className="container centered-page">
        <div className="not-found-card">
          <p className="eyebrow">Error 404</p>
          <h1>Page not found</h1>
          <p>The page you requested does not exist or might have been moved.</p>
          <Link className="btn btn-dark" to="/">
            Back to home
          </Link>
        </div>
      </section>
    </main>
  )
}

export default NotFoundPage