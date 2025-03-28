import React from 'react'

import Date from './Date';

const Calendar = () => {
	return (
		<div className="admin-content">
			<h1>Calendar</h1>
			
			<div className="calendar main-content">
				<Date />
			</div>
		</div>
	)
}

export default Calendar