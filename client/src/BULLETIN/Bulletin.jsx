import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';

import './Bulletin.css';

const Bulletin = () => {
	const [bulletins, setBulletin] = useState([]);

    useEffect(() => {
		fetchBulletin();
    }, []);

	const fetchBulletin = async () => {
		const response = await axios.get('http://localhost:3000/bulletin');
		setBulletin(response.data);
	};

    return (
		<div className='bulletin'>
			<nav>
				<img src="logo.png" alt="" />

				<div className="nav-link">
					<Link to='/eba'>EBA</Link>
					<Link to='/'>Virtual Try-On</Link>
				</div>
			</nav>

			<h1>ANNOUNCEMENT</h1>

			<div className="card-block">
				{bulletins.map((bulletin, index) => (
					<div className="card" key={index}>
						<h3>{bulletin.Title}</h3>
						<p className="writer">Written by: <span>{bulletin.Faculty} {bulletin.Faculty_Staff}</span></p>
						<p>{bulletin.Details}</p>
					</div> 
				))}
			</div>
		</div>
	)
}

export default Bulletin