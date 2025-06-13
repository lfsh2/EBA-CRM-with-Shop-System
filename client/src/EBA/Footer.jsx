import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
	return (
		<div className='footer'>
			<div className="logo">
				<img src='/logo.png' alt="" />
			</div>

			<div className="contact-us">
				<h3>CONTACT US</h3>

				<p>Bahay Katuparan, Bagtas, Tanza, Philippines</p>

				<div className="text-block">
					<p>Phone: (046) 414 3979</p>
					<p>Email: cvsutanza@cvsu.edu.ph</p>
					<p>Web: www.cvsu-tanza.edu.ph</p>
				</div>
			</div>

			<div className="follow-us">
				<h3>FOLLOW US</h3>

				<div className="icon-block">
					<a href="https://www.facebook.com/CvSUTC" target='_blank'>
						<FontAwesomeIcon icon={faFacebook} className='icon'/>
					</a>
				</div>
			</div>
		</div>
	)
}

export default Footer