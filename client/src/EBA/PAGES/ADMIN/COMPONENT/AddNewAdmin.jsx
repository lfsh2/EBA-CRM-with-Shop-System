import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const AddNewAdmin = () => {
	const [admins, setAdmins] = useState([]);
	const [addingAdmin, setAddingAdmin] = useState(false);

	const [image, setImage] = useState();
	const [username, setUsername] = useState('');
	const [role, setRole] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const [formMessage, setFormMessage] = useState('');

	const [editingAdmin, setEditingAdmin] = useState(null);
    const [formData, setFormData] = useState({ 
        Username: '', 
        Role: '', 
        Email_Address: '', 
        Password: ''
    });

	useEffect(() => {
		fetchAdmins();
    }, []);
	
	const fetchAdmins = async () => {
		const response = await axios.get('http://localhost:3000/admin');
		setAdmins(response.data);
	};

	const createUser = (e) => {
		e.preventDefault();
		
		const formData = new FormData();
		formData.append('admin', image);
	
		formData.append('Username', username);
		formData.append('Role', role);
		formData.append('Email', email);
		formData.append('Password', password);

		axios.post('http://localhost:3000/addnewadmin', formData)
		.then(res => {
			if (res.data.Status === "Success") {
				setMessage("Admin added successfully");
				setTimeout(() => {
					setMessage('');
				}, 2000);
				
				setAddingAdmin(false);
				fetchAdmins();

				setUsername('');
				setRole('');
				setEmail('');
				setPassword('');
			} 
			if (res.data.Status === "Username or Email already exists") {
				setFormMessage("Username or Email already exists");

				setTimeout(() => {
					setFormMessage('');
				}, 2000);
			}
			else {
				console.log("Failed");
			}
		})
		.catch(err => {
			setFormMessage('Please fill all field')
			
			setTimeout(() => {
				setFormMessage('');
			}, 2000);
		});
	};

	const handleEdit = (admin) => {
		setEditingAdmin(admin);
		setFormData({
			username: admin.Username, 
			role: admin.Role, 
            email: admin.Email_Address, 
            password: admin.Password
		});
	};

	const handleUpdate = async () => {
		const formdata = new FormData();

		if (image) {
			formdata.append('admin', image);
		}

		formdata.append('Username', formData.username);
		formdata.append('Role', formData.role);
		formdata.append('Email', formData.email);
		formdata.append('Password', formData.password);

		axios.put(`http://localhost:3000/addnewadmin/${editingAdmin.ID}`, formdata)
		.then(res => {
			if (res.data.Status === "Success") {
				setMessage("Admin edited successfully");
				setTimeout(() => {
					setMessage('');
				}, 2000);
				
				setEditingAdmin(false);
				fetchAdmins();

				setUsername('');
				setRole('');
				setEmail('');
				setPassword('');
			} 
			if (res.data.Status === "Username or Email already exists") {
				setFormMessage("Username or Email already exists");

				setTimeout(() => {
					setFormMessage('');
				}, 2000);
			}
		})
		.catch(err => {
			setFormMessage('Please fill all field')
			
			setTimeout(() => {
				setFormMessage('');
			}, 2000);
		});
	};

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRemove = async (id) => {
		await axios.delete(`http://localhost:3000/addnewadmin/${id}`);
		setAdmins(admins.filter(admin => admin.id !== id));

		setMessage("Admin deleted successfully");
		setTimeout(() => {
			setMessage('');
		}, 2000);

		fetchAdmins();
    };

	return (
		<div className="admin-content">
			<h1>Manage Accounts</h1>

			<div className="add-new-admin main-content">
				<div className="top">
					<h2>Admin Accounts</h2>
					<button onClick={() => setAddingAdmin((prev) => !prev)}><FontAwesomeIcon icon={faUserPlus} /></button>
				</div>

				<table>
					<thead>
						<tr>
							<th>Image</th>
							<th>Username</th>
							<th>Role</th>
							<th>Email Address</th>
							<th>Password</th>
							<th>Action</th>
						</tr>
					</thead>

					<tbody>
						{admins.map((admin, index) => (
							<tr key={index}>
								<td><img src={`http://localhost:3000/UPLOADS/${admin.Image}`} alt="" /> </td>
								<td>{admin.Username}</td>
								<td>{admin.Role}</td>
								<td>{admin.Email_Address}</td>
								<td>{admin.Password}</td>
								<td className='btn'>
									<button onClick={() => handleEdit(admin)}>Edit</button>
									<button onClick={() => handleRemove(admin.ID)}>Remove</button>
								</td>
							</tr>
						))}	
					</tbody>
				</table>

				{message && <div className='message msg'>{message}</div>}

				{addingAdmin && (
					<div className="modal-container">
						<div className="add-new-admin-modal modal">
							<div className="title">
								<FontAwesomeIcon icon={faChevronLeft} className='icon' onClick={() => setAddingAdmin((prev) => !prev)} />
								<h3>Add Admin</h3>
							</div>

							<form onSubmit={createUser}>
								<div className="input-block">
									<label>Image:</label>
									<input 
										type="file" 
										onChange={(e) => setImage(e.target.files[0])}
										required
									/>
								</div>
								<div className="input-block">
									<label htmlFor="username">Username:</label>
									<input
										type="text"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										placeholder='Enter Username'
										required 
									/>
								</div>
								<div className="input-block">
									<label htmlFor="role">Role:</label>
									<select
										value={role}
										onChange={(e) => setRole(e.target.value)}
										required 
									>
										<option value="" disabled>Select Role</option>
										<option value="Admin">Admin</option>
										<option value="EBA">EBA</option>
										<option value="DEAN">DEAN</option>
									</select>
								</div>
								<div className="input-block">
									<label htmlFor="email">Email Address:</label>
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder='Enter Email Address'
										required
									/>
								</div>
								<div className="input-block">
									<label htmlFor="password">Password:</label>
									<input
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder='Enter Password'
										required 
									/>
								</div>

								{formMessage && <div className='form-message'>{formMessage}</div>}
								
								<button type='submit'>Add</button>
							</form>
						</div>
					</div>
				)}

				{editingAdmin && (
					<div className="modal-container">
						<div className="add-new-admin-modal modal">
							<div className="title">
								<FontAwesomeIcon icon={faChevronLeft} className='icon' onClick={() => setEditingAdmin(null)}/>
								<h3>Edit Admin</h3>
							</div>

							<form>
								<div className="input-block">
									<label>Image:</label>
									<input 
										type="file" 
										onChange={(e) => setImage(e.target.files[0])}
										required
									/>
								</div>
								<div className="input-block">
									<label>Username:</label>
									<input
										type="text"
										name='username'
										value={formData.username}
										onChange={handleChange}
										placeholder='Enter Username'
										required 
									/>
								</div>
								<div className="input-block">
									<label>Role:</label>
									<select
										name='role'
										value={formData.role}
										onChange={handleChange}
										required 
									>
										<option value="" disabled>Select Role</option>
										<option value="Admin">Admin</option>
										<option value="EBA">EBA</option>
										<option value="DEAN">DEAN</option>
									</select>
								</div>
								<div className="input-block">
									<label>Email Address:</label>
									<input
										type="email"
										name='email'
										value={formData.email}
										onChange={handleChange}
										placeholder='Enter Email Address'
										required 
									/>
								</div>
								<div className="input-block">
									<label>Password:</label>
									<input
										type="password"
										name='password'
										onChange={handleChange}
										placeholder='Enter Password'
									/>
								</div>


								{formMessage && <div className='form-message'>{formMessage}</div>}
								
								<button type='button' onClick={handleUpdate}>Edit</button>
							</form>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AddNewAdmin;
