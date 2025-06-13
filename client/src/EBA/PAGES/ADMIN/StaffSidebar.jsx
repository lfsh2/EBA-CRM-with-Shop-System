import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './CSS/Sidebar.css';

const Sidebar = ({ onMenuClick, isOpen, handleLogout }) => {
    const [activeButton, setActiveButton] = useState('Dashboard');

    const handleButtonClick = (componentName) => {
        setActiveButton(componentName);
        onMenuClick(componentName);
	};

    return (
		<div className="sidebar-container">
			<div className="sidebar">
				<div className="block">
					<div className="group">
						<button
							onClick={() => handleButtonClick('Dashboard')}
							className={activeButton === 'Dashboard' ? 'active' : ''}
						>
							<img src='/admin/dashboard.png' /> Dashboard
						</button>
						<button
							onClick={() => handleButtonClick('Transaction')}
							className={activeButton === 'Transaction' ? 'active' : ''}
						>
							<img src='/admin/transaction.png' /> Transaction
						</button>
						<button
							onClick={() => handleButtonClick('Announcement')}
							className={activeButton === 'Announcement' ? 'active' : ''}
						>
							<img src='/admin/announcement.png' /> Events & Announcement
						</button>
						<button
							onClick={() => handleButtonClick('Inventory')}
							className={activeButton === 'Inventory' ? 'active' : ''}
						>
							<img src='/admin/inventory.png' /> Inventory
						</button>
					</div>

					<hr />

					<div className="group">
						<button className='logout' onClick={handleLogout}>
							<img src="admin/logout.png" alt="" />
							Logout
						</button>
					</div>
				</div>
			</div>

			<div className="responsive-sidebar">
				{isOpen && (
					<div className="block">
						<div className="group">
							<button
								onClick={() => handleButtonClick('Dashboard')}
								className={activeButton === 'Dashboard' ? 'active' : ''}
							>
								<img src='/admin/dashboard.png' /> Dashboard
							</button>
							<button
								onClick={() => handleButtonClick('Transaction')}
								className={activeButton === 'Transaction' ? 'active' : ''}
							>
								<img src='/admin/transaction.png' /> Transaction
							</button>
							<button
								onClick={() => handleButtonClick('Announcement')}
								className={activeButton === 'Announcement' ? 'active' : ''}
							>
								<img src='/admin/announcement.png' /> Events & Announcement
							</button>
							<button
								onClick={() => handleButtonClick('Inventory')}
								className={activeButton === 'Inventory' ? 'active' : ''}
							>
								<img src='/admin/inventory.png' /> Inventory
							</button>
						</div>

						<hr />

						<div className="group">
							<Link to='/'>
								<button onClick={handleLogout}>
									<img src="admin/logout.png" alt="" />
									Logout
								</button>
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Sidebar;
