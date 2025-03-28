import React, { useState } from 'react'
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isAbout, setIsAbout] = useState(false);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const toggleAbout = () => {
		setIsAbout(!isAbout);
	};

	return (
		<div className="navbar">
			<nav>
				<div className='nav-links'>
					<div className="logo">
						<img src='/logo.png' />
						<span> External Business Affairs</span>
					</div>

					<ul className="links">
						<Link to='/'>Home</Link>
						<Link to='/userlogin'>Store</Link>
						<button onClick={toggleAbout}>About</button>
						{isAbout && (
							<div className="about-dropdown">
								<Link to='/abouteba'>Mission and Vision</Link>
								<Link to="/aboutdeveloper">About the Developer</Link>
							</div>
						)}
						<button onClick={toggleDropdown} className='toggle-btn'>
							<FontAwesomeIcon icon={faBars} />
						</button>
					</ul>
				</div>

				<div className="dropdown">
					{isOpen && (
					<ul className="dropdown-menu">
						<Link to="/">Home</Link>
						<Link to="/userlogin">Store</Link>
						<button onClick={toggleAbout}>About</button>
						{isAbout && (
							<div className="about-dropdown">
								<Link to="/abouteba">Mission and Vision</Link>
								<Link to="/aboutdeveloper">About the Developer</Link>
							</div>
						)}
					</ul>
					)}
				</div>
			</nav>
		</div>
	)
}

export default Navbar