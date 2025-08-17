import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTimes } from '@fortawesome/free-solid-svg-icons';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

import './CSS/LandingStore.css';
import './CSS/Preloader.css';
import InputForm from '../../InputForm';

const UserSignin = () => {
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
	];

	const onChange = (e) => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!values.email.endsWith('@cvsu.edu.ph')) {
			setMessage('Use CvSU account');
			setTimeout(() => setMessage(''), 3000);
			return;
		}

		setLoading(true);

		axios.post('http://localhost:3000/usersignup', values)
			.then(res => {
				if (res.data.Status === "Success") {
					const { token } = res.data;
					localStorage.setItem('token', token);
					navigateTo('/userlogin');
				} else if (res.data.Status === "Email address already exists") {
					setMessage(res.data.Status);
					setTimeout(() => setMessage(''), 2000);
				} else {
					console.log("Signup failed");
				}
			})
			.catch(() => {
				setMessage('Invalid credentials');
				setTimeout(() => setMessage(''), 3000);
			})
			.finally(() => setLoading(false));
	};

	const handleGoogleSuccess = async (credentialResponse) => {
		setLoading(true);
		try {
			// Decode the credential to get user information
			const decoded = jwtDecode(credentialResponse.credential);
			
			// Check if email is from cvsu.edu.ph domain
			if (!decoded.email.endsWith('@cvsu.edu.ph')) {
				setMessage('Please use your CvSU email account (@cvsu.edu.ph)');
				setTimeout(() => setMessage(''), 3000);
				setLoading(false);
				return;
			}

			// Proceed with authentication
			const res = await axios.post('http://localhost:3000/auth/google', {
				token: credentialResponse.credential,
			});

			localStorage.setItem('token', res.data.token || '');
			navigateTo('/userlogin');
		} catch (err) {
			const errMsg = err.response?.data?.message || 'Google sign-in failed';
			setMessage(errMsg);
			setTimeout(() => setMessage(''), 3000);
		} finally {
			setLoading(false);
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
					</div>x``
					<div className="preloader-text">Signing Up...</div>
				</div>
			</div>
		);
	}

	return (
		<div className='cvsu-login-container'>
			<div className='cvsu-login-form'>
				<div className="cvsu-header">
					<div
						className="cvsu-logo"
						onClick={() => navigateTo("/eba")}
						style={{ cursor: "pointer" }}
					>
						<img src="/logo.png" alt="CvSU Logo" className="logo-diamond" />
						<FontAwesomeIcon icon={faTimes} className='icon' />
					</div>

					<div className="cvsu-title">
						<h1>CAVITE STATE UNIVERSITY</h1>
						<h2>TANZA CAMPUS</h2>
						<h3>EBA SHOP PORTAL</h3>
					</div>
				</div>

				
				<div className="cvsu-form-content">
					<div className="google-signin-description">
						<p>Sign up with your CvSU Google Account</p>
						<span>Only @cvsu.edu.ph accounts are allowed</span>
						<br /><br />
						<small>Already have account? <a href="/userlogin">Click here</a> to register.</small>
					</div>

					<div style={{ textAlign: 'center' }}>
						<GoogleLogin
							onSuccess={handleGoogleSuccess}
							onError={() => {
								setMessage('Google Sign-In Failed');
								setTimeout(() => setMessage(''), 3000);
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserSignin;
