import React, { useState } from 'react'

const Date = () => {
	const [openCalendar, setOpenCalendar] = useState(false);

	const toggleCalendar = () => {
		setOpenCalendar(!openCalendar);
	}
	
	return (
		<div className='date'> 
			<p onClick={toggleCalendar}>10-10-2024 ~ 10-20-2024</p>

			{openCalendar && (
				<>
					<img src="/developers/paulo.png" alt="" />
				</>
			)}
		</div>
	)
}

export default Date