import React from 'react'

import Navbar from '../Navbar'
import Footer from '../Footer'

const About = () => {
	return (
		<div className='about'>
			<Navbar />

			<div className="container">
				<div className="cvsu">
					<h1>CAVITE STATE UNIVERSITY - TANZA CAMPUS</h1>
				</div>

				<div className="university mission">
					<h1>University Mission</h1>

					<p>CAVITE STATE UNIVERSITY shall provide excellent, equitable and relevant educational opportunities in the arts, sciences, and technology through quality instruction and responsive research and development activities. It shall produce professional skilled and morally upright individuals for global competitiveness.</p>
				</div>

				<div className="university vision">
					<h1>University Vision</h1>

					<p>The premier university in historic Cavite globally recognized for excellence in character development, academics, research, innovation, and sustainable community engagement.</p>
				</div>
			</div>

			<Footer />
		</div>
	)
}

export default About