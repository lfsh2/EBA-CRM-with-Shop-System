import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarPlus, faChevronLeft, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';

const localizer = momentLocalizer(moment);

const Announcement = () => {
	const [announcements, setAnnouncements] = useState([]);
	const [addAnnouncement, setAddAnnouncement] = useState(false);
	
	const [title, setTitle] = useState('');
	const [details, setDetails] = useState('');
	const [faculty, setFaculty] = useState('');
	const [facultyName, setFacultyName] = useState('');
	const [message, setMessage] = useState('');
	
	const [editAnnouncement, setEditAnnouncement] = useState(null);
	const [formData, setFormData] = useState({ 
		title: '', 
		details: '', 
		faculty: '', 
		facultyName: '', 
		announcementDate: new Date()
	});

	const [startDate, setStartDate] = useState(new Date());

	const toggleAddAnnouncement = () => {
		setAddAnnouncement((prev) => !prev);
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
			FacultyName: facultyName,
			announcementDate: startDate.toISOString()
		})
		.then((response) => {
			if (response.data.Status === "Success") {
				setTitle('');
				setDetails('');
				setFaculty('');
				setFacultyName('');
				setStartDate(new Date());

				setAddAnnouncement(false);
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
			facultyName: announcement.Faculty_Staff,
			announcementDate: announcement.announcementDate ? new Date(announcement.announcementDate) : new Date()
		});
	};
	const handleUpdate = async () => {
		try {
			const updatedData = {
				Title: formData.title,
				Details: formData.details,
				Faculty: formData.faculty,
				FacultyName: formData.facultyName,
				announcementDate: formData.announcementDate.toISOString()
			};

			const response = await axios.put(`http://localhost:3000/announcement/${editAnnouncement.ID}`, updatedData);

			if (response.data.Status === "Success") {
				setEditAnnouncement(null);
				setMessage('Event/Announcement edited successfully');
				setTimeout(() => {
					setMessage('');
				}, 2000);
				fetchAnnouncement();
			}
		} catch (err) {
			console.log(err);
			setMessage('Failed to update announcement');
			setTimeout(() => {
				setMessage('');
			}, 2000);
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
	const events = announcements.map(announcement => {
		const eventDate = announcement.announcementDate ? new Date(announcement.announcementDate) : new Date();
		
		return {
			title: announcement.Title,
			start: eventDate,
			end: eventDate,
			allDay: true,
			desc: announcement.Details,
			faculty: `${announcement.Faculty} ${announcement.Faculty_Staff}`
		};
	});

	return (
		<div className="admin-content">
			<h1>Events & Announcement</h1>

			<div className="announcement main-content">
				<Calendar
					localizer={localizer}
					events={events}
					startAccessor="start"
					endAccessor="end"
					style={{ height: 500, margin: '20px 0' }}
					views={['month', 'week', 'day']}
					defaultView='month'
					tooltipAccessor={(event) => `${event.title}\n${event.desc}\nBy: ${event.faculty}`}
					popup
					selectable
					onSelectEvent={(event) => {
						setMessage(`${event.title} - ${event.desc}`);
						setTimeout(() => setMessage(''), 3000);
					}}
				/>
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
						<FontAwesomeIcon icon={faChevronLeft} className='icon' onClick={toggleAddAnnouncement}/>
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

							<div className="input-block">
								<label>Event Date:</label>
								<DatePicker 
									selected={startDate} 
									onChange={(date) => setStartDate(date)}
									showTimeSelect
									timeFormat="HH:mm"
									timeIntervals={15}
									dateFormat="MMMM d, yyyy h:mm aa"
									minDate={new Date()}
									required 
									className="date-picker"
									placeholderText="Select date and time"
								/>
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

							<div className="input-block">
								<label>Event Date:</label>
								<DatePicker 
									selected={new Date(formData.announcementDate)} 
									onChange={(date) => setFormData({ ...formData, announcementDate: date })}
									showTimeSelect
									timeFormat="HH:mm"
									timeIntervals={15}
									dateFormat="MMMM d, yyyy h:mm aa"
									minDate={new Date()}
									required 
									className="date-picker"
									placeholderText="Select date and time"
								/>
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
