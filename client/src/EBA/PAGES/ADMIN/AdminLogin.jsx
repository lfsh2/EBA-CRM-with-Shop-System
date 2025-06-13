import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import './CSS/AdminLogin.css';

import InputForm from '../../InputForm';

const Login = () => {
	const [message, setMessage] = useState('');
	const navigateTo = useNavigate();
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

	const loginAdmin = async (e) => {
		e.preventDefault();
	
		try {
			const response = await axios.post('http://localhost:3000/adminlogin', values);
			const { token } = response.data;
			localStorage.setItem('token', token);
		
			const decodedToken = JSON.parse(atob(token.split('.')[1]));
			if (decodedToken.role === 'DEAN' || decodedToken.role === 'EBA') {
				navigateTo('/adminpanel');
			} else {
				navigateTo('/staffadminpanel');
			}
		} catch (err) {
		  	setMessage('Invalid credentials');
		}
	};
	
	return (
		<div className='login-form'>
			<div className='form'>
				<form onSubmit={loginAdmin}>
					<div className='title'>
						<a href='/' className='login-button'><FontAwesomeIcon icon={faArrowLeft} /></a>
						<h2>LOGIN</h2>
					</div>

					<div className="input-container">
						{inputs.map((input) => (
							<InputForm 
								key={input.id} 
								{...input} 
								value={values[input.name]}
								onChange={onChange} 
							/>
						))}
					</div>
					
					<p className={message ? 'error' : 'errors'}>{message}</p>

					<button type='submit'>Login</button>
				</form>
			</div>
		</div>
	)
}

export default Login
