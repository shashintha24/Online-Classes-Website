import { Link } from 'react-router-dom'

function LoginPage() {
	return (
		<main className="site-shell centered-page">
			<section className="auth-card">
				<p className="eyebrow">WELCOME BACK</p>
				<h1>Login to EduPulse</h1>
				<form className="auth-form">
					<label htmlFor="email">Email</label>
					<input id="email" type="email" placeholder="you@example.com" />
					<label htmlFor="password">Password</label>
					<input id="password" type="password" placeholder="Enter your password" />
					<button type="button" className="btn btn-primary">
						Sign In
					</button>
				</form>
				<p>
					New here? <Link to="/register">Create account</Link>
				</p>
			</section>
		</main>
	)
}

export default LoginPage
