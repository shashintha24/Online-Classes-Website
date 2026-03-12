import { Link } from 'react-router-dom'
import Header from '../components/header/Header'
const courses = [
	{ title: 'Frontend Development Bootcamp', level: 'Beginner', lessons: 36, duration: '10 Weeks' },
	{ title: 'Data Structures with JavaScript', level: 'Intermediate', lessons: 28, duration: '8 Weeks' },
	{ title: 'UI/UX Design Masterclass', level: 'Beginner', lessons: 24, duration: '6 Weeks' },
	{ title: 'Backend APIs with Node.js', level: 'Advanced', lessons: 31, duration: '9 Weeks' },
]

function CoursePage() {
	return (
		<main className="site-shell">
			<Header />
			<section className="container page-head">
				<p className="eyebrow">COURSE CATALOG</p>
				<h1>Choose your next skill track</h1>
			</section>

			<section className="container course-grid">
				{courses.map((course) => (
					<article key={course.title} className="course-card">
						<p className="pill">{course.level}</p>
						<h3>{course.title}</h3>
						<p>{course.lessons} lessons</p>
						<p>{course.duration}</p>
						<button className="btn btn-primary">Enroll Now</button>
					</article>
				))}
			</section>

			<section className="container back-row">
				<Link to="/" className="btn btn-outline">
					Back to Home
				</Link>
			</section>
		</main>
	)
}

export default CoursePage
