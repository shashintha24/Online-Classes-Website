import { Link } from 'react-router-dom'

function Header() {
  return (
    <>
      <div className="top-promo">Save up to 70% on top courses. Ends tonight.</div>
      <header className="site-header">
        <div className="container header-row">
          <Link to="/" className="brand" aria-label="LearnHub home">
            <span className="brand-dot">L</span>
            <span className="brand-text">LearnHub</span>
          </Link>

          <button className="nav-link category-btn" type="button">
            Categories
          </button>

          <label className="search-wrap" htmlFor="global-search">
            <span className="search-icon">Search</span>
            <input id="global-search" type="text" placeholder="Search for anything" />
          </label>

          <nav className="main-nav" aria-label="Main navigation">
            <Link className="nav-link" to="/courses">
              Explore
            </Link>
            <Link className="nav-link" to="/dashboard">
              My Learning
            </Link>
            <Link className="nav-link" to="/admin">
              Teach
            </Link>
          </nav>

          <div className="nav-actions">
            <button className="icon-btn" type="button" aria-label="Shopping cart">
              Cart
            </button>
            <Link to="/login" className="btn btn-outline">
              Log in
            </Link>
            <Link to="/register" className="btn btn-dark">
              Sign up
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
