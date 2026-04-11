import { Link } from 'react-router-dom'
import Header from '../components/header/Header'

function RegisterPage() {
	return (
		<main className="site-shell">
			<Header />
			<section className="container auth-layout">
				<article className="auth-side">
					<p className="eyebrow">Get started</p>
					<h1>Create your account and start learning today</h1>
					<p>
						Join thousands of learners mastering technology, business, and creative skills with
						structured tracks.
					</p>
				</article>

				<section className="auth-card">
					<h2>Create account</h2>
					<form className="auth-form">
						<label htmlFor="name">Full name</label>
						<input id="name" type="text" placeholder="Your full name" />
						<label htmlFor="email">Email</label>
						<input id="email" type="email" placeholder="you@example.com" />
						<label htmlFor="password">Password</label>
						<input id="password" type="password" placeholder="Create a strong password" />
						<button type="button" className="btn btn-dark">
							Create account
						</button>
					</form>
					<p>
						Already have an account? <Link to="/login">Log in</Link>
					</p>
				</section>
			</section>
		</main>
	)
}

export default RegisterPage
