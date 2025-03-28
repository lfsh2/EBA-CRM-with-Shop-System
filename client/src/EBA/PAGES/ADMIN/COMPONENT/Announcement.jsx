import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Date from './Date';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarPlus, faChevronLeft, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

const Announcement = () => {
	const [announcements, setAnnouncements] = useState([]);
	const [addAnnouncement, setAddAnnouncement] = useState('');
	
	const [title, setTitle] = useState('');
	const [details, setDetails] = useState('');
	const [faculty, setFaculty] = useState('');
	const [facultyName, setFacultyName] = useState('');
	const [message, setMessage] = useState('');
	
	const [editAnnouncement, setEditAnnouncement] = useState(null);
    const [formData, setFormData] = useState({ 
        Title: '', 
        Details: '', 
        Faculty: '', 
        Faculty_Staff: ''
    });

	const toggleAddAnnouncement = () => {
		setAddAnnouncement(!addAnnouncement);
	};

	useEffect(() => {
		fetchAnnouncement();
    }, []);
	
	const fetchAnnouncement = async () => {
		const response = await axios.get('http://localhost:3000/bulletin');
		setAnnouncements(response.data);
	};
	
	const createEventAnnouncement = (e) => {
		e.preventDefault();

		axios.post('http://localhost:3000/announcement', {
			Title: title,
			Details: details,
			Faculty: faculty,
			FacultyName: facultyName
		})
		.then((response) => {
			if (response.data.Status === "Success") {
				setTitle('');
				setDetails('');
				setFaculty('');
				setFacultyName('');
				
				setAddAnnouncement(null);
				fetchAnnouncement();
				setMessage('Event/Announcement added successfully');
				setTimeout(() => {
					setMessage('');
				}, 2000);
			}
		})
	}

	const handleEdit = (announcement) => {
		setEditAnnouncement(announcement);
		setFormData({ 
			title: announcement.Title, 
			details: announcement.Details, 
			faculty: announcement.Faculty, 
			facultyName: announcement.Faculty_Staff
		});
	};

	const handleUpdate = async () => {
		try {
			const response = await axios.put(`http://localhost:3000/announcement/${editAnnouncement.ID}`, formData);

			if (response.data.Status === "Success") {
				setAnnouncements(announcements.map(announcement => 
					announcement.ID === editAnnouncement.ID 
					? { ...announcement, ...formData } 
					: announcement
				));
			} else {
				setEditAnnouncement(null);
				setMessage('Event/Announcement edited successfully');
				setTimeout(() => {
					setMessage('');
				}, 2000);

				fetchAnnouncement();
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleRemove = async (id) => {
		await axios.delete(`http://localhost:3000/announcement/${id}`);
		setAnnouncements(announcements.filter(announcement => announcement.id !== id));
		
		setMessage("Event/Announcement deleted successfully");
		setTimeout(() => {
			setMessage('');
		}, 2000);

		fetchAnnouncement();
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
					<button onClick={toggleAddAnnouncement}><FontAwesomeIcon icon={faCalendarPlus} /></button>
				</div>

				{announcements.length === 0 ? (
					<h3 className='no'>No Announcement</h3>
				) : (
					<div className="lists">
						{announcements.map((announcement, index) => (
							<div className='card' key={index}>
								<div className="card-btn">
									<h3>{announcement.Title}</h3>

									<div className="btn-block">
										<button onClick={() => handleEdit(announcement)}><FontAwesomeIcon icon={faPenToSquare} /></button>
										<button onClick={() => handleRemove(announcement.ID)}><FontAwesomeIcon icon={faTrash} /></button>
									</div>
								</div>

								<h5>Written by: {announcement.Faculty} {announcement.Faculty_Staff}</h5>
								<p>{announcement.Details}</p>
							</div>
						))}
					</div>
				)}

				{message && <div className='message'>{message}</div>}
			</div>

			{addAnnouncement && (
				<div className="modal-container">
					<div className="add-events-announcement modal">
						<div className="title">
						<FontAwesomeIcon icon={faChevronLeft} className='icon' onClick={() => setAddAnnouncement(null)}/>
						<h3>Add Events/Announcement</h3>
						</div>

						<form onSubmit={createEventAnnouncement}>
							<div className="input-block">
								<label>Title:</label>
								<input 
									type="text"
									value={title} 
									onChange={(e) => setTitle(e.target.value)}
									placeholder='Enter Title'
									required 
								/>
							</div>

							<div className="input-block">
								<label>Details:</label>
								<textarea 
									value={details} 
									onChange={(e) => setDetails(e.target.value)}
									placeholder='Enter Details'
									required 
								/>
							</div>

							<div className="input-block">
								<label>Faculty Staff Name:</label>

								<div className="group">
									<select 
										value={faculty} 
										onChange={(e) => setFaculty(e.target.value)}
										required 
									>
										<option value="" disabled>Select Option</option>
										<option value="Ms.">Ms.</option>
										<option value="Mrs.">Mrs.</option>
										<option value="Mr.">Mr.</option>
										<option value="Mx.">Mx.</option>
									</select>

									<input 
										type="text"
										value={facultyName} 
										onChange={(e) => setFacultyName(e.target.value)}
										placeholder='Enter Faculty Name'
										required 
									/>
								</div>
							</div>

							<button type="submit">Add</button>
						</form>
					</div>
				</div>
			)}
			{editAnnouncement && (
				<div className="modal-container">
					<div className="add-events-announcement modal">
						<div className="title">
						<FontAwesomeIcon icon={faChevronLeft} className='icon' onClick={() => setEditAnnouncement(null)}/>
						<h3>Edit Events/Announcement</h3>
						</div>

						<form>
							<div className="input-block">
								<label>Title:</label>
								<input 
									type="text"
									name='title'
									value={formData.title} 
									onChange={handleChange}
									placeholder='Enter Title'
									required 
								/>
							</div>

							<div className="input-block">
								<label>Details:</label>
								<textarea 
									name='details'
									value={formData.details} 
									onChange={handleChange}
									placeholder='Enter Details'
									required 
								/>
							</div>

							<div className="input-block">
								<label>Faculty Staff Name:</label>
								<div className="group">
									<select 
										name='faculty'
										value={formData.faculty} 
										onChange={handleChange}
										required 
									>
										<option value="" disabled>Select Option</option>
										<option value="Ms.">Ms.</option>
										<option value="Mrs.">Mrs.</option>
										<option value="Mr.">Mr.</option>
										<option value="Mx.">Mx.</option>
									</select>

									<input 
										type="text"
										name='facultyName'
										value={formData.facultyName} 
										onChange={handleChange}
										placeholder='Enter Faculty Name'
										required 
									/>
								</div>
							</div>

							<button type="button" onClick={handleUpdate}>Edit</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default Announcement;
