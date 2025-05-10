import React, {useState} from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import Navbar from './Navbar';
import Footer from './Footer';

import './EBA.css'

const EBA = () => {
	// carousel
	const [currentIndex, setCurrentIndex] = useState(0);

	const slides = [
		{
			image: 'ITEMS/STUDENT_UNIFORM/Male_Student_Uniform.png',
			title: 'Male Uniform',
			description: "Trying on the campus uniform is made easy with the help of Augmented Reality, you can easily see how the uniform would look while you're wearing it, without the need to wear one physically."
		},
		{
			image: '/FemaleUniform.png',
			title: 'Female Uniform',
			description: "Trying on the campus uniform is made easy with the help of Augmented Reality, you can easily see how the uniform would look while you're wearing it, without the need to wear one physically."
		},
		{
			image: '/Faculty.png',
			title: 'Faculty Uniform',
			description: "Trying on the campus uniform is made easy with the help of Augmented Reality, you can easily see how the uniform would look while you're wearing it, without the need to wear one physically."
		},
		{
			image: '/Department.png',
			title: 'Department Shirt',
			description: "Trying on the campus uniform is made easy with the help of Augmented Reality, you can easily see how the uniform would look while you're wearing it, without the need to wear one physically."
		}
	];
	const goToPrevious = () => {
		const isFirstSlide = currentIndex === 0;
		const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
		setCurrentIndex(newIndex);
	};
	const goToNext = () => {
		const isLastSlide = currentIndex === slides.length - 1;
		const newIndex = isLastSlide ? 0 : currentIndex + 1;
		setCurrentIndex(newIndex);
	};


	return (
		<div className='eba'>
			<Navbar />

			{/* first section */}
			<div className="first-section">
				<div className="group">
					<div className="text">
						<div className="title">
							<h2 className='highlight'>Augmented Reality <p>for</p></h2>
							<h2>Virtual Clothing Try-on</h2>

							<p className='description'>Trying out now shirt designs has never been this easy!</p>
						</div>

						<div className="btns">
							<a href="/capstone"><FontAwesomeIcon icon={faUser} /> Learn More</a>
						</div>
					</div>

					<div className="images">
						<div className="card">
							<img src='/ITEMS/STUDENT_UNIFORM/Male_Student_Uniform.png' />
						</div>
						<div className="card">
							<img src='/FemaleUniform.png' />
						</div>
					</div>
				</div>
			</div>

			{/* second page */}
			<div className="second-section">
				<h1><p>Augmented Reality</p> for Trying-On</h1>

				<div className="carousel">
					<div className="carousel-slide">
						<div className="img-block">
							<img src={slides[currentIndex].image} alt={`Slide ${currentIndex + 1}`} className="carousel-image" />
						</div>

						<div className="carousel-content">
							<div className="group">
								<div className="text">
									<h2>{slides[currentIndex].title}</h2>
									<p>{slides[currentIndex].description}</p>
								</div>

								<div className="btns">
									<button className="carousel-button1" onClick={goToPrevious}><FontAwesomeIcon icon={faChevronLeft} /></button>
									<button className="carousel-button2" onClick={goToNext}><FontAwesomeIcon icon={faChevronRight} /></button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* third section */}
			<div className="third-section">
				<div className="text">
					<h1><p>Why use <span>Augmented</span></p> <span>Reality?</span></h1>

					<p className='description'>by using the innovating technology, specifically the Augmented Reality, the users are able to see a visual representation of the different clothing that are available through EBA. </p>
				</div>

				<div className="cards">
					<div className="card">
						<h3>Efficiency</h3>
						<p>by using the system, you are capable of an efficient way of trying on different clothing, that would otherwise be time-consuming due to wearing the clothing yourself physically.</p>
					</div>

					<div className="card">
						<h3>Safety & Hygiene</h3>
						<p>by trying on clothing virtually through the AR system, you are at a lesser risk of being sick by wearing the same clothing that other people had also worn.</p>
					</div>
				</div>
			</div>

			{/* fourth section */}
			<div className="fourth-section">
				<h1>Available Services</h1>

				<p className='description'>Currently, here are some of the services and products that the External Business and Affairs are offering.</p>

				<div className="group">
					<div className="card">
						<h3>Books</h3>
						<p>various modules and books for different programs are available in our EBA.</p>
					</div>
					
					<div className="card">
						<h3>Clothing Try-on</h3>
						<p>Trying on different uniforms and campus shirts has never been easy! With the help of Augmented Reality, you can easily try different clothes on!</p>
					</div>

					<div className="card">
						<h3>Capstone Module</h3>
						<p>Specifically for the Information Technology students, capstone manuals are also sold at EBA.</p>
					</div>

					<div className="card">
						<h3>Printing Services</h3>
						<p>Printing services inside of campus is also available through our EBA.</p>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	)
}

export default EBA