import { Link } from 'react-router-dom'
import Header from '../components/header/Header'


function NotFoundPage() {
  return (
    <main className="site-shell centered-page">
      <Header />
      <div className="not-found-card">
        <p className="eyebrow">ERROR 404</p>
        <h1>Page not found</h1>
        <p>The page you requested does not exist or has been moved.</p>
        <Link className="btn btn-primary" to="/">
          Back to Home
        </Link>
      </div>
    </main>
  )
}

export default NotFoundPage