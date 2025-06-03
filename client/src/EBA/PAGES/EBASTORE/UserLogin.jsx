import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import './CSS/LandingStore.css';
import './CSS/Preloader.css';
import InputForm from '../../InputForm';

const UserLogin = () => {
	const navigateTo = useNavigate();
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [values, setValues] = useState({
		email: '',
		password: ''
	});

	const inputs = [
		{
			id: 1,
			type: 'email',
			name: 'email',
			placeholder: 'Enter your email address',
			errorMsg: 'Invalid email address', 
			label: 'Email Address',
			required: true
		},
		{
			id: 2,
			type: 'password',
			name: 'password',
			placeholder: 'Enter your password',
			errorMsg: 'Incorrect password', 
			label: 'Password',
			required: true
		}
	]

	const onChange = (e) => {
		setValues({...values, [e.target.name]: e.target.value})
	}

	
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
	
		try {
			const response = await axios.post('http://localhost:3000/userlogin', values);
			const { token } = response.data;

			localStorage.setItem('token', token);

			setTimeout(() => {
				navigateTo('/ebastore');
			}, 3000);
		} catch (err) {
			setLoading(false);
			setMessage('Invalid credentials');
			setTimeout(() => {
				setMessage('')
			}, 3000);
		}
	};

	if (loading) {
		return (
			<div className="preloader">
				<div className="preloader-content">
					<div className="cube-loader">
						<div className="cube"></div>
						<div className="cube"></div>
						<div className="cube"></div>
						<div className="cube"></div>
						<div className="cube"></div>
						<div className="cube"></div>
					</div>
					<div className="preloader-text">Logging in...</div>
				</div>
			</div>
		);
	}

	return (
		<div className='login-form'>
			<div className='form'>
				<form onSubmit={handleSubmit}>
					<div className='title'>
						<a href='/' className='login-button'><FontAwesomeIcon icon={faArrowLeft} /></a>
						<h2>LOGIN</h2>
					</div>

					{inputs.map((input) => (
						<InputForm 
							key={input.id} 
							{...input} 
							value={values[input.name]}
							onChange={onChange} 
						/>
					))}

					<p>Don't have account? <a href="/usersignup">create account here.</a></p>

					{message && <div className='messages'>{message}</div>}

					<button type='submit'>Login</button>
				</form>
			</div>
		</div>
	)
}

export default UserLogin