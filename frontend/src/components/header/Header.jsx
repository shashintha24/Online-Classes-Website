import { Link } from 'react-router-dom'

function header(){
    return(

<header className="topbar container">
        <div className="brand-mark">E</div>
        <h1 className="brand-name">EduPulse</h1>
        <nav className="nav-links">
          <Link to="/courses">Courses</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/admin">Admin</Link>
        </nav>
        <div className="nav-actions">
          <Link to="/login" className="btn btn-ghost">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary">
            Start Free
          </Link>
        </div>
      </header>);}

export default header;
