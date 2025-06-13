import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';

import './Bulletin.css';

const Bulletin = () => {
	const [bulletins, setBulletin] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

    useEffect(() => {
		fetchBulletin();
    }, []);

	const fetchBulletin = async () => {
		try {
			setLoading(true);
			const response = await axios.get('http://localhost:3000/bulletin');
			setBulletin(response.data);
			setError(null);
		} catch (err) {
			console.error('Failed to fetch bulletins:', err);
			setError('Failed to load announcements. Please try again later.');
		} finally {
			setLoading(false);
		}
	};

    return (
		<div className='bulletin'>
			<nav>
				<img src="/logo.png" alt="Logo" />

				<div className="nav-link">
					<Link to='/eba'>EBA</Link>
					<Link to='/'>Virtual Try-On</Link>
				</div>
			</nav>

			<h1>ANNOUNCEMENT</h1>
			
			{loading && <div className="loading">Loading announcements...</div>}
			{error && <div className="error">{error}</div>}
			{!loading && !error && bulletins.length === 0 && (
				<div className="no-announcements">No announcements available</div>
			)}

			<div className="card-block announcement">
				{bulletins.map((bulletin, index) => (
					<div className="card" key={index}>
						<h3>{bulletin.Title}</h3>
						<p className="writer">Written by: <span>{bulletin.Faculty} {bulletin.Faculty_Staff}</span></p>
						<p>{bulletin.Details}</p>
					</div> 
				))}
			</div>

			{/* <div className="card-block shop-announcement">
				{bulletins.map((bulletin, index) => (
					<div className="card" key={index}>
						<h3>{bulletin.Title}</h3>
						<p className="writer">Written by: <span>{bulletin.Faculty} {bulletin.Faculty_Staff}</span></p>
						<p>{bulletin.Details}</p>
					</div> 
				))}
			</div> */}
		</div>
	)
}

export default Bulletin