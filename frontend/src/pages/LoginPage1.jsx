import { Link } from 'react-router-dom'
import Header from '../components/header/Header'

function LoginPage() {
	return (
		<main className="site-shell">
			<Header />
			<section className="container auth-layout">
				<article className="auth-side">
					<p className="eyebrow">Welcome back</p>
					<h1>Continue your learning journey</h1>
					<p>
						Access your saved lessons, progress dashboard, and personalized recommendations.
					</p>
				</article>

				<section className="auth-card">
					<h2>Log in to LearnHub</h2>
					<form className="auth-form">
						<label htmlFor="email">Email</label>
						<input id="email" type="email" placeholder="you@example.com" />
						<label htmlFor="password">Password</label>
						<input id="password" type="password" placeholder="Enter your password" />
						<button type="button" className="btn btn-dark">
							Log in
						</button>
					</form>
					<p>
						New to LearnHub? <Link to="/register">Create account</Link>
					</p>
				</section>
			</section>
		</main>
	)
}

export default LoginPage
