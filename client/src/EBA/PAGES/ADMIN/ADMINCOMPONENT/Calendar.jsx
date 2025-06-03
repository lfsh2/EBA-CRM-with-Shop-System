import React from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import '../CSS/Date.css'

const CalendarComponent = () => {
	const [value, setValue] = React.useState(new Date());
	const [view, setView] = React.useState('month');

	const onChange = (nextValue) => {
		setValue(nextValue);
	}

	const onViewChange = ({ view }) => {
		setView(view);
	}

	return (
		<div className="admin-content">
			<h1>Calendar</h1>
			
			<div className="calendar main-content">
				<Calendar 
					onChange={onChange}
					value={value}
					view={view}
					onViewChange={onViewChange}
					className="custom-calendar"
					defaultView="month"
					defaultActiveStartDate={new Date()}
					showNeighboringMonth={false}
					minDetail="month"
				/>
			</div>
		</div>
	)
}

export default CalendarComponent