import { Link } from 'react-router-dom'
import Header from '../components/header/Header'
const filters = ['All', 'Development', 'Business', 'IT and Software', 'Design', 'Marketing']

const courses = [
	{
		title: 'React and TypeScript Masterclass',
		instructor: 'Jonas Schmedtmann',
		level: 'Intermediate',
		hours: '42 total hours',
		lectures: '318 lectures',
		rating: '4.8',
		students: '138,203',
		price: '$15.99',
		original: '$94.99',
	},
	{
		title: 'Data Analysis with Python and Pandas',
		instructor: 'Jose Portilla',
		level: 'Beginner',
		hours: '27 total hours',
		lectures: '211 lectures',
		rating: '4.6',
		students: '92,121',
		price: '$13.99',
		original: '$74.99',
	},
	{
		title: 'Docker and Kubernetes From Zero to Hero',
		instructor: 'Bret Fisher',
		level: 'All levels',
		hours: '33 total hours',
		lectures: '260 lectures',
		rating: '4.7',
		students: '77,941',
		price: '$16.99',
		original: '$109.99',
	},
	{
		title: 'The Product Management Career Accelerator',
		instructor: 'Cole Mercer',
		level: 'Beginner',
		hours: '18 total hours',
		lectures: '144 lectures',
		rating: '4.5',
		students: '54,019',
		price: '$12.99',
		original: '$69.99',
	},
]

function CoursePage() {
	return (
		<main className="site-shell">
			<Header />
			<section className="container page-head">
				<p className="eyebrow">Course catalog</p>
				<h1>Results for your growth goals</h1>
				<p>Explore curated tracks, trending skills, and project-first learning experiences.</p>
			</section>

			<section className="container catalog-layout">
				<aside className="filter-panel">
					<h3>Filter by topic</h3>
					<div className="filter-list">
						{filters.map((filter, index) => (
							<button key={filter} className={index === 0 ? 'chip active' : 'chip'} type="button">
								{filter}
							</button>
						))}
					</div>
					<h3>Skill level</h3>
					<div className="filter-list">
						<button className="chip" type="button">
							Beginner
						</button>
						<button className="chip" type="button">
							Intermediate
						</button>
						<button className="chip" type="button">
							Advanced
						</button>
					</div>
				</aside>

				<div className="list-panel">
					{courses.map((course) => (
						<article className="list-card" key={course.title}>
							<div className="list-thumb" aria-hidden="true" />
							<div>
								<p className="pill">{course.level}</p>
								<h3>{course.title}</h3>
								<p className="author">{course.instructor}</p>
								<p className="muted">
									{course.hours} | {course.lectures}
								</p>
								<p className="rating">
									{course.rating} rating | {course.students} students
								</p>
							</div>
							<div className="price-col">
								<p className="price-row">
									<strong>{course.price}</strong>
								</p>
								<span>{course.original}</span>
								<button className="btn btn-dark" type="button">
									Add to cart
								</button>
							</div>
						</article>
					))}
				</div>
			</section>

			<section className="container back-row">
				<Link to="/" className="btn btn-outline">
					Back to home
				</Link>
			</section>
		</main>
	)
}

export default CoursePage
