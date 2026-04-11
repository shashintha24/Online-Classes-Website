import { Link } from 'react-router-dom'
import Header from '../components/header/Header'

function AdminPage() {
	return (
		<main className="site-shell">
			<Header />
			<section className="container page-head">
				<p className="eyebrow">Instructor dashboard</p>
				<h1>Control center for your academy</h1>
			</section>

			<section className="container admin-grid">
				<article className="dashboard-card">
					<h3>Total enrollments</h3>
					<p className="big-number">42,810</p>
					<p className="muted">+12.3% vs last month</p>
				</article>
				<article className="dashboard-card">
					<h3>Active courses</h3>
					<p className="big-number">128</p>
					<p className="muted">9 courses updated this week</p>
				</article>
				<article className="dashboard-card">
					<h3>Average rating</h3>
					<p className="big-number">4.7</p>
					<p className="muted">From 18,402 reviews</p>
				</article>
			</section>

			<section className="container dashboard-grid">
				<article className="dashboard-card">
					<h3>Performance alerts</h3>
					<ul className="simple-list">
						<li>
							<span>Cloud Fundamentals</span>
							<span>High demand</span>
						</li>
						<li>
							<span>Design Sprint Workshop</span>
							<span>Low completion</span>
						</li>
						<li>
							<span>AI for PMs</span>
							<span>Top rated</span>
						</li>
					</ul>
				</article>

				<article className="dashboard-card">
					<h3>Quick actions</h3>
					<div className="quick-actions">
						<button className="btn btn-dark" type="button">
							Create new course
						</button>
						<button className="btn btn-outline" type="button">
							Launch promotion
						</button>
						<button className="btn btn-outline" type="button">
							Export reports
						</button>
					</div>
				</article>
			</section>

			<section className="container back-row">
				<Link to="/" className="btn btn-outline">
					Back to home
				</Link>
			</section>
		</main>
	)
}

export default AdminPage
