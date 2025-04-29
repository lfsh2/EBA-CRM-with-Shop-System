import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import Sidebar from './Sidebar';
import Dashboard from './COMPONENT/Dashboard';
import Transaction  from './COMPONENT/Transaction';
import Announcement from './COMPONENT/Announcement';
import Inventory from './COMPONENT/Inventory';
import Calendar from './COMPONENT/Calendar';
import AddNewAdmin from './COMPONENT/AddNewAdmin';
import AddDesign from './COMPONENT/AddDesign';
import Pages from './COMPONENT/Pages';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEnvelope, faBell, faSun, faMoon, faX, faChevronDown, } from '@fortawesome/free-solid-svg-icons';

import './CSS/Admin.css';
import './CSS/Component.css';

const AdminPanel = () => {
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [openDropdown, setOpenDropdown] = useState(false);
	const [activeAdmin, setActiveComponent] = useState('Dashboard');
	const [isOpen, setIsOpen] = useState(false);
	const [image, setImage] = useState('');
	const [username, setUsername] = useState('');

	const navigateTo = useNavigate();
	const token = localStorage.getItem('token');

	useEffect(() => {
		if (!token) {
			window.location.href = '/adminlogin';
			return;
		}

		const decodedToken = JSON.parse(atob(token.split('.')[1]));
		if (decodedToken.role !== 'DEAN' && decodedToken.role !== 'EBA') {
		  window.location.href = '/adminlogin';
		}

		setImage(decodedToken.image);
		setUsername(decodedToken.username);
	}, [token])

	const handleMenuClick = (componentName) => {
		setActiveComponent(componentName);
	}

	const handleLogout = () => {
		localStorage.removeItem('token');
		
		navigateTo('/adminlogin');
	};	

	return (
		<div className={isDarkMode ? 'adminpanel dark-mode' : 'adminpanel light-mode'}>
			<div className="navbar">
				<nav>
					<button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
						<FontAwesomeIcon icon={isOpen ? faX : faBars} className='icon' />
					</button>

					<div className="logo">
						<img src='/logo.png' alt="" />
						<h4>EBA Admin Panel</h4>
					</div>

					<div className="buttons">
						<button>
							<FontAwesomeIcon icon={faEnvelope} className='icon' />
						</button>

						<button>
							<FontAwesomeIcon icon={faBell} className='icon'/>
						</button>

						<button onClick={() => setIsDarkMode(!isDarkMode)} className='toggle-theme'>
							<FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className='icon' />
						</button>

						<div className="user-profile">
							<p>Hi, {username}</p>
							<img src={`http://localhost:3000/UPLOADS/${image}`} alt="" />
						</div>
					</div>
				</nav>
			</div>

			<div className="container">
				<Sidebar onMenuClick={handleMenuClick} isOpen={isOpen} handleLogout={handleLogout}/>

				<div className='content'>
					{activeAdmin === 'Dashboard' && <Dashboard />}
					{activeAdmin === 'Transaction' && <Transaction />}
					{activeAdmin === 'Announcement' && <Announcement />}
					{activeAdmin === 'Inventory' && <Inventory />}
					{activeAdmin === 'Calendar' && <Calendar />}
					{activeAdmin === 'AddNewAdmin' && <AddNewAdmin />}
					{activeAdmin === 'AddDesign' && <AddDesign />}
					{activeAdmin === 'Pages' && <Pages />}
				</div>
			</div>
		</div>
	)
}

export default AdminPanel