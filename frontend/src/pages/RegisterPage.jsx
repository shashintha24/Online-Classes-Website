import { Link } from 'react-router-dom'

function RegisterPage() {
	return (
		<main className="site-shell centered-page">
			<section className="auth-card">
				<p className="eyebrow">GET STARTED</p>
				<h1>Create your classroom</h1>
				<form className="auth-form">
					<label htmlFor="name">Full Name</label>
					<input id="name" type="text" placeholder="Your full name" />
					<label htmlFor="email">Email</label>
					<input id="email" type="email" placeholder="you@example.com" />
					<label htmlFor="password">Password</label>
					<input id="password" type="password" placeholder="Create a strong password" />
					<button type="button" className="btn btn-primary">
						Create Account
					</button>
				</form>
				<p>
					Already have an account? <Link to="/login">Login</Link>
				</p>
			</section>
		</main>
	)
}

export default RegisterPage
