import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import '../CSS/Date.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarPlus, faChevronLeft, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

const Date = () => {
    const [value, setValue] = useState(new Date());
    const [announcements, setAnnouncements] = useState([]);
    const [selectedAnnouncements, setSelectedAnnouncements] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        details: '',
        faculty: '',
        facultyName: '',
        date: new Date()
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get('http://localhost:3000/calendar/events');
            setAnnouncements(response.data);
            updateSelectedAnnouncements(value);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        }
    };

    const updateSelectedAnnouncements = (date) => {
        const dayAnnouncements = announcements.filter(announcement => {
            const announcementDate = new Date(announcement.Date);
            return announcementDate.toDateString() === date.toDateString();
        });
        setSelectedAnnouncements(dayAnnouncements);
    };

    const handleDateClick = (date) => {
        setValue(date);
        updateSelectedAnnouncements(date);
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/calendar/event', {
                Title: formData.title,
                Details: formData.details,
                Faculty: formData.faculty,
                FacultyName: formData.facultyName,
                Date: formData.date
            });
            setMessage('Event added successfully');
            setShowAddModal(false);
            fetchAnnouncements();
            setFormData({
                title: '',
                details: '',
                faculty: '',
                facultyName: '',
                date: new Date()
            });
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error adding event:', error);
            setMessage('Error adding event');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleEditEvent = async (id) => {
        try {
            await axios.put(`http://localhost:3000/calendar/event/${id}`, {
                Title: formData.title,
                Details: formData.details,
                Faculty: formData.faculty,
                FacultyName: formData.facultyName,
                Date: formData.date
            });
            setMessage('Event updated successfully');
            fetchAnnouncements();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error updating event:', error);
            setMessage('Error updating event');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const tileContent = ({ date }) => {
        const hasAnnouncements = announcements.some(announcement => {
            const announcementDate = new Date(announcement.Date);
            return announcementDate.toDateString() === date.toDateString();
        });

        return hasAnnouncements ? (
            <div className="announcement-dot" />
        ) : null;
    };

    return (
        <div className='date-container'>
            <div className='date-header'>
                <div className="header-content">
                    <p>{value.toLocaleDateString()}</p>
                    <button onClick={() => setShowAddModal(true)} className="add-event-btn">
                        <FontAwesomeIcon icon={faCalendarPlus} />
                    </button>
                </div>
            </div>

            <div className="calendar-container">
                <Calendar
                    onChange={handleDateClick}
                    value={value}
                    tileContent={tileContent}
                    className="custom-calendar"
                />
                
                {selectedAnnouncements.length > 0 && (
                    <div className="announcements-list">
                        <h3>Events for {value.toLocaleDateString()}</h3>
                        {selectedAnnouncements.map((announcement, index) => (
                            <div key={index} className="announcement-item">
                                <div className="announcement-header">
                                    <h4>{announcement.Title}</h4>
                                    <div className="announcement-actions">
                                        <button onClick={() => {
                                            setFormData({
                                                title: announcement.Title,
                                                details: announcement.Details,
                                                faculty: announcement.Faculty,
                                                facultyName: announcement.Faculty_Staff,
                                                date: new Date(announcement.Date)
                                            });
                                            handleEditEvent(announcement.ID);
                                        }}>
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                    </div>
                                </div>
                                <p>{announcement.Details}</p>
                                <small>By: {announcement.Faculty} {announcement.Faculty_Staff}</small>
                            </div>
                        ))}
                    </div>
                )}

                {showAddModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Add New Event</h3>
                                <button onClick={() => setShowAddModal(false)}>
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                            </div>
                            <form onSubmit={handleAddEvent}>
                                <div className="input-block">
                                    <label>Title:</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="input-block">
                                    <label>Details:</label>
                                    <textarea
                                        value={formData.details}
                                        onChange={(e) => setFormData({...formData, details: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="input-block">
                                    <label>Faculty:</label>
                                    <select
                                        value={formData.faculty}
                                        onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                                        required
                                    >
                                        <option value="">Select Title</option>
                                        <option value="Ms.">Ms.</option>
                                        <option value="Mrs.">Mrs.</option>
                                        <option value="Mr.">Mr.</option>
                                        <option value="Mx.">Mx.</option>
                                    </select>
                                </div>
                                <div className="input-block">
                                    <label>Faculty Name:</label>
                                    <input
                                        type="text"
                                        value={formData.facultyName}
                                        onChange={(e) => setFormData({...formData, facultyName: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="input-block">
                                    <label>Date:</label>
                                    <input
                                        type="date"
                                        value={formData.date.toISOString().split('T')[0]}
                                        onChange={(e) => setFormData({...formData, date: new Date(e.target.value)})}
                                        required
                                    />
                                </div>
                                <button type="submit">Add Event</button>
                            </form>
                        </div>
                    </div>
                )}

                {message && <div className="message">{message}</div>}
            </div>
        </div>
    );
};

export default Date;