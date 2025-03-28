import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Date from './Date';

const Announcement = () => {
	const [announcements, setAnnouncements] = useState([]);

	useEffect(() => {
		fetchAnnouncement();
    }, []);
	
	const fetchAnnouncement = async () => {
		const response = await axios.get('http://localhost:3000/bulletin');
		setAnnouncements(response.data);
	};

	return (
		<div className="admin-content">
			<h1>Events & Announcement</h1>

			<div className="announcement main-content">
				<Date />
			</div>

			<div className="announcement main-content">
				<div className="top">
					<h2>Upcoming Events/Announcement</h2>
				</div>

				{announcements.length === 0 ? (
					<h3 className='no'>No Announcement</h3>
				) : (
					<div className="lists">
						{announcements.map((announcement, index) => (
							<div className='card' key={index}>
								<div className="card-btn">
									<h3>{announcement.Title}</h3>
								</div>

								<h5>Written by: {announcement.Faculty} {announcement.Faculty_Staff}</h5>
								<p>{announcement.Details}</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Announcement;
