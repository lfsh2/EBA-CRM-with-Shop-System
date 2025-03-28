import React from 'react'

import './CSS/LandingStore.css'

const LandingStore = () => {
	return (
		<div className='landingStore'>
			<img src='/logo.png' alt="" />
			
			<div className="text">
				<div className="title">
					<h1>Welcome to EBA</h1>
					<h1>Store</h1>
				</div>

				<p>Get your supplies here</p>

				<a href="/ebauserlogin">Get Started</a>
			</div>
		</div>
	)
}

export default LandingStore