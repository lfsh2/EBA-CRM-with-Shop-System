import React, { useState, useEffect } from 'react'

import './CSS/LandingStore.css'
import './CSS/Preloader.css'

const LandingStore = () => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false);
		}, 3000);

		return () => clearTimeout(timer);
	}, []);

	if (loading) {
		return (
			<div className="preloader">
				<div className="preloader-content">
					<div className="cube-loader">
						<div className="cube"></div>
						<div className="cube"></div>
						<div className="cube"></div>
						<div className="cube"></div>
						<div className="cube"></div>
						<div className="cube"></div>
					</div>
					<div className="preloader-text">Loading EBA Store...</div>
				</div>
			</div>
		);
	}

	return (
		<div className='landingStore'>
			<img src='/logo.png' alt="" />
			
			<div className="text">
				<div className="title">
					<h1>Welcome to EBA</h1>
					<h1>Store</h1>
				</div>

				<p>Get your supplies here</p>

				<a href="/ebastore">Get Started</a>
			</div>
		</div>
	)
}

export default LandingStore