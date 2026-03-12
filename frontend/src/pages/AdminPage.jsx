import { Link } from 'react-router-dom'
import Header from '../components/header/Header'

function AdminPage() {
	return (
		<main className="site-shell">
			<Header />
			<section className="container page-head">
				<p className="eyebrow">ADMIN PANEL</p>
				<h1>Class platform control center</h1>
			</section>

			<section className="container admin-grid">
				<article className="dashboard-card">
					<h3>Total Students</h3>
					<p className="big-number">12,840</p>
				</article>
				<article className="dashboard-card">
					<h3>Published Courses</h3>
					<p className="big-number">96</p>
				</article>
				<article className="dashboard-card">
					<h3>Active Instructors</h3>
					<p className="big-number">184</p>
				</article>
			</section>

			<section className="container back-row">
				<Link to="/" className="btn btn-outline">
					Back to Home
				</Link>
			</section>
		</main>
	)
}

export default AdminPage
