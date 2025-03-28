import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './CSS/Store.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faLocationDot, faChevronRight, faMagnifyingGlass, faMicrophone, faPlus, faCartShopping } from '@fortawesome/free-solid-svg-icons';

const data = {
	uniform: [
		{ name: 'Student Uniform', imgMale: '/MaleUniform.png', imgFemale: '/FemaleUniform.png' },
		{ name: 'Faculty Uniform', imgMale: '/Faculty.png', imgFemale: '/Faculty.png' },
		{ name: 'Department Shirt', imgMale: '/Department.png', imgFemale: '/Department.png' }
	],
	student: [
		{ name: 'Student Uniform', imgMale: '/MaleUniform.png', imgFemale: '/FemaleUniform.png' }
	],
	faculty: [
		{ name: 'Faculty Uniform', imgMale: '/Faculty.png', imgFemale: '/Faculty.png' }
	],
	department: [
		{ name: 'Department Shirt', imgMale: '/Department.png', imgFemale: '/Department.png' }
	],
	module: [
		{ name: 'Modules', imgMale: '/Book.png' }
	],
	manual: [
		{ name: 'Capstone Manual', imgMale: '/Book.png' }
	]
}

const deptShirtTypes = [
	{ name: 'BSED', imgMale: '/Department.png', imgFemale: '/Department.png' },
	{ name: 'BSIT', imgMale: '/Department.png', imgFemale: '/Department.png' },
	{ name: 'BSHM', imgMale: '/Department.png', imgFemale: '/Department.png' },
	{ name: 'BSTM', imgMale: '/Department.png', imgFemale: '/Department.png' },
	{ name: 'BSBM', imgMale: '/Department.png', imgFemale: '/Department.png' },
	{ name: 'BSEE', imgMale: '/Department.png', imgFemale: '/Department.png' },
]

const Store = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [activeCategory, setActiveCategory] = useState('all');
	const [selectedItem, setSelectedItem] = useState(null);
	const [showCards, setShowCards] = useState(false);
	const [showDeptShirt, setShowDeptShirt] = useState(false);
	const [filteredCategory, setFilteredCategory] = useState('all');

	const [openModal, setOpenModal] = useState(false);

	const [image, setImage] = useState();
	const [itemName, setItemName] = useState('');
	const [variantName, setVariantName] = useState('');
	const [size, setSize] = useState('');
	const [quantity, setQuantity] = useState('');
	const [fullName, setFullName] = useState('');
	const [emailAddress, setEmailAddress] = useState('');
	const [phone, setPhone] = useState('');
	const [amount, setAmount] = useState('300');

	const [message, setMessage] = useState('');
	const [formMessage, setFormMessage] = useState('');
	
	const [carts, setCart] = useState([]);
	const token = localStorage.getItem('token');
	const navigateTo = useNavigate();

	useEffect(() => {
		if (!token) {
			window.location.href = '/userlogin';
			return;
		}
	
		const decodedToken = JSON.parse(atob(token.split('.')[1]));
		setFullName(decodedToken.fullname);
		setEmailAddress(decodedToken.email);
	
		axios.get('http://localhost:3000/cartItem', {
			headers: {
				Authorization: token,
			},
		})
		.then((response) => {
			const cartItems = response.data.cartItems || [];
			setCart(cartItems); 
		})
		.catch((err) => {
			console.error(err.response ? err.response.data.message : 'An error occurred');
		});
	}, [token]);

	const handleLogout = () => {
		localStorage.removeItem('token');
		
		navigateTo('/userlogin');
	};	
	

	function uniformFormValidation() {
		if (!itemName || !variantName || !size || !quantity || !fullName || !emailAddress || !phone) {
			setFormMessage('Please fill in all required fields.');
			setTimeout(() => {
				setFormMessage('');
			}, 2000);
			return;
		}
		createOrderUniform();
	}

	const createOrderUniform = async () => {
		const formData = new FormData();
		formData.append('transaction', image);

		formData.append('ItemName', itemName);
		formData.append('Variant', variantName);
		formData.append('Size', size);
		formData.append('Quantity', quantity);
		formData.append('CustomerName', fullName);
		formData.append('EmailAddress', emailAddress);
		formData.append('PhoneNumber', phone);
		formData.append('Amount', amount);
		
		try {
			const response = await fetch('http://localhost:3000/addOrderUniform', {
				method: 'POST',
				body: formData
			});
			
			if (response.ok) {
				console.log('data submitted')

				setMessage("Added to the cart successfully");
				setTimeout(() => {
					setMessage('');
					location.reload()
				}, 2000);

				setOpenUniform(false);

				setItemName('');
				setVariantName('');
				setSize('');
				setQuantity('');
				setFullName('');
				setEmailAddress('');
				setPhone('');
				setAmount('');
			} else {
				console.log('failed submit')
			}
		} catch (error) {
			console.log('error submitting')
		}
	};

	function itemFormValidation() {
		if (!itemName || !quantity || !fullName || !emailAddress || !phone) {
			setFormMessage('Please fill in all required fields.');
			setTimeout(() => {
				setFormMessage('');
			}, 2000);
			return;
		}
		createOrderItem();
	}
	
	const createOrderItem = async () => {
		const formData = new FormData();
		formData.append('transaction', image);

		formData.append('ItemName', itemName);
		formData.append('Quantity', quantity);
		formData.append('CustomerName', fullName);
		formData.append('EmailAddress', emailAddress);
		formData.append('PhoneNumber', phone);
		formData.append('Amount', amount);

		try {
			const response = await fetch('http://localhost:3000/addOrderItem', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				console.log('data submitted')

				setMessage("Added to the cart successfully");
				setTimeout(() => {
					setMessage('');
					location.reload()
				}, 2000);
				

				setItemName('');
				setQuantity('');
				setFullName('');
				setEmailAddress('');
				setPhone('');
				setPayment('');
				setAmount('');
			} else {
				console.log('failed submit')
			}
		} catch (error) {
			console.log('error submitting')
		}
	};
	
	useEffect(() => {
		setActiveCategory(filteredCategory);
	}, [filteredCategory]);
	
	const handleSearch = (event) => {
	  const term = event.target.value.toLowerCase();
	  setSearchTerm(term);
	  setShowCards(term !== '');

	  if (term === '') {
		setFilteredCategory('all');
		setSelectedItem(null);
	} else {
		const category = Object.keys(data).find(cat => 
			data[cat].some(item => item.name.toLowerCase(). includes(term))
		);
		setFilteredCategory(category || 'all');
		setSelectedItem(null);
	  }
	};
  
	const handleCategoryChange = (category) => {
		setActiveCategory(category);
		setSearchTerm('');
		setSelectedItem(null);
		setShowCards(true);
		setShowDeptShirt(false);
		setFilteredCategory(category);
	};
	
	const handleCardClick = (item) => {
		if (activeCategory === 'module' || activeCategory === 'manual') {
			setItemName(item.name);
			setImage(item.imgMale);
			setOpenModal(true);
		} else if (item.name === 'Department Shirt') {
			setShowDeptShirt(true);
		} else {
			setSelectedItem(item);
			setShowDeptShirt(false);
		}
	};
	
	const handleVariantClick = (variant, itemName, itemImage) => {
		setVariantName(variant);
		setItemName(itemName);
		setImage(itemImage);
		setOpenModal(true);
	};
	  
	const filterItems = (items) => {
	  return items.filter(item => item.name.toLowerCase().includes(searchTerm));
	};
  
	const getItemsToDisplay = () => {
		if (showDeptShirt) {
			return (
				<div className="fourth-section">
					{deptShirtTypes.map((dept, index) => (
						<div key={index} className="card" onClick={() => handleCardClick(dept)}>
							<img src={dept.imgMale} alt={dept.name} />
							<div className="name">
								<h3>{dept.name}</h3>
							</div>
						</div>
					))}
				</div>
			);
		}

		if (selectedItem) {
			return (
				<div className="fourth-section">
					<div className="card" onClick={() => handleVariantClick('Male', `${selectedItem.name}`, `${selectedItem.imgMale}`)}>
						<img src={selectedItem.imgMale} alt={`${selectedItem.name} Male`} />
						<div className="name">
							<h3>Male</h3>
						</div>
					</div>
					<div className="card" onClick={() => handleVariantClick('Female', `${selectedItem.name}`, `${selectedItem.imgFemale}`)}>
						<img src={selectedItem.imgFemale} alt={`${selectedItem.name} Female`} />
						<div className="name">
							<h3>Female</h3>
						</div>
					</div>
				</div>
			);
		}

		const itemsToDisplay = filteredCategory === 'all'
		? Object.values(data).flat()
		: data[filteredCategory];

		return (
			<div className="fourth-section">
				{filterItems(itemsToDisplay).map((item, index) => (
					<div key={index} className="card" onClick={() => handleCardClick(item)}>
						<img src={item.imgMale} alt={item.name} />
						<div className="name">
							<h3>{item.name}</h3>
						</div>
					</div>
				))}
			</div>
		)
	}

	const shouldShowBackground = searchTerm === '' && activeCategory === 'all';
	const shouldShowButtons = searchTerm === '' && activeCategory === 'all';

	return (
		<div className="store-container">
			{message && <div className='message'>{message}</div>}

			{openModal && (
				<div className="order-container">
					<div className="order-modal">
						<div className="title">
							<FontAwesomeIcon icon={faChevronLeft} className='icon' onClick={() => setOpenModal(null)} />
							<h3>Order Form</h3>
						</div>
					
						<form onSubmit={(e) => e.preventDefault()}>
							<div className="input-container">
								<h4>Order Information</h4>
						
								<div className="input-block">
									<label>Image: </label>
									<img src={image} alt="" />
								</div>
						
								<div className="input-block">
									<label>Item: </label>
									<input
									type="text"
									value={itemName}
									onChange={(e) => setItemName(e.target.value)}
									placeholder='Enter item name'
									readOnly
									/>
								</div>
						
								<div className="input-block">
									<label>Item Variant: </label>
									<input
									type="text"
									value={variantName}
									onChange={(e) => setVariantName(e.target.value)}
									placeholder='Enter variant'
									readOnly
									/>
								</div>
						
								<div className="input-block">
									<label>Item Size: </label>
									<input
									type="text"
									value={size}
									onChange={(e) => setSize(e.target.value)}
									placeholder='Enter size'
									required
									/>
								</div>
						
								<div className="input-block">
									<label>Item Quantity: </label>
									<input
									type="number"
									value={quantity}
									onChange={(e) => setQuantity(e.target.value)}
									placeholder='Enter quantity'
									required
									/>
								</div>
							</div>
					
							<div className="input-container">
								<h4>Customer Information</h4>
						
								<div className="input-block">
									<label>Name: </label>
									<input
									type="text"
									value={fullName}
									onChange={(e) => setFullName(e.target.value)}
									placeholder='Enter your full name'
									required
									/>
								</div>
						
								<div className="input-block">
									<label>Email Address: </label>
									<input
									type="email"
									value={emailAddress}
									onChange={(e) => setEmailAddress(e.target.value)}
									placeholder='Enter your address'
									required
									/>
								</div>
						
								<div className="input-block">
									<label>Phone Number: </label>
									<input
									type="number"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									placeholder='Enter your phone number'
									required
									/>
								</div>
						
								<div className="input-block">
									<label>Amount: </label>
									<input
									type="number"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									placeholder='Enter your amount'
									readOnly
									/>
								</div>
							</div>
					
							{formMessage && <div className='form-message'>{formMessage}</div>}
					
							<button	type="button" onClick={uniformFormValidation}>
								Place Order
							</button>
						</form>
					</div>
				</div>
			)}
			
			<div className="store">
				<header>
					<nav>
						<div className="group">
							<a href="/ebastore"><FontAwesomeIcon icon={faChevronLeft} className='icon'/></a>
							<button onClick={handleLogout}><h3>EBA Store</h3></button>
						</div>
						<a href="/ebacart" className='cart'><FontAwesomeIcon icon={faCartShopping} /><span>{carts.length}</span></a>
					</nav>
					
					{shouldShowBackground && (
						<div className="university">
							<div className="group">
								<div className="location">
									<FontAwesomeIcon icon={faLocationDot} className='icon' />
								</div>
								<div className="campus">
									<p>Cavite State University</p>
									<h4>Tanza Campus</h4>
								</div>
							</div>
							<a href=""><FontAwesomeIcon icon={faChevronRight} className='icon'/></a>
						</div>
					)}
				</header>

				<section className="first-section">
					<FontAwesomeIcon icon={faMagnifyingGlass} className='search' />
					<input 
						type="text" 
						name="search" 
						id="search" 
						placeholder='Search product' 
						value={searchTerm}
						onChange={handleSearch}
						required />
					<FontAwesomeIcon icon={faMicrophone} className='mic' />
				</section>


				{shouldShowBackground && (
					<section className="second-section">
						<div className="top">
							<h1>Exclusive Offer</h1>
						</div>

						<div className="card-block">
							<div className="card">
								<div className="group">
									<div className="img-block">
										<img src='/MaleUniform.png' alt="" />
									</div>
									<div className="info">
										<h3>Student Uniform</h3>
										<p>S, M, L, XL</p>
									</div>
								</div>

								<div className="buttons">
									<p>Price may vary</p>
									<button onClick={() => handleCategoryChange('student')}>
										<FontAwesomeIcon icon={faPlus} />
									</button>
								</div>
							</div>
							<div className="card">
								<div className="group">
									<div className="img-block">
										<img src='/Faculty.png' alt="" />
									</div>
									<div className="info">
										<h3>Faculty Uniform</h3>
										<p>S, M, L, XL</p>
									</div>
								</div>

								<div className="buttons">
									<p>Price may vary</p>
									<button onClick={() => handleCategoryChange('faculty')}>
										<FontAwesomeIcon icon={faPlus} />
									</button>
								</div>
							</div>
							<div className="card">
								<div className="group">
									<div className="img-block">
										<img src='/Department.png' alt="" />
									</div>
									<div className="info">
										<h3>Department Shirt</h3>
										<p>S, M, L, XL</p>
									</div>
								</div>

								<div className="buttons">
									<p>Price may vary</p>
									<button onClick={() => handleCategoryChange('department')}>
										<FontAwesomeIcon icon={faPlus} />
									</button>
								</div>
							</div>
							<div className="card">
								<div className="group">
									<div className="img-block">
										<img src='/Book.png' alt="" />
									</div>
									<div className="info">
										<h3>Module</h3>
									</div>
								</div>

								<div className="buttons">
									<p>Price may vary</p>
									<button onClick={() => handleCategoryChange('module')}>
										<FontAwesomeIcon icon={faPlus} />
									</button>
								</div>
							</div>
							<div className="card">
								<div className="group">
									<div className="img-block">
										<img src='/Book.png' alt="" />
									</div>
									<div className="info">
										<h3>Capstone Manual</h3>
									</div>
								</div>

								<div className="buttons">
									<p>Price may vary</p>
									<button onClick={() => handleCategoryChange('manual')}>
										<FontAwesomeIcon icon={faPlus} />
									</button>
								</div>
							</div>
						</div>
					</section>
				)}

				{shouldShowButtons && (
					<section className="third-section">
						<h1>Categories</h1>
						<div className="card-block">
							<div className="card">
								<button onClick={() => handleCategoryChange('uniform')}>
									<img src='/MaleUniform.png' alt="" />
								</button>
								<p>Uniforms</p>
							</div>
							<div className="card">
								<button onClick={() => handleCategoryChange('module')}>
									<img src='/Book.png' alt="" />
								</button>
								<p>Module</p>
							</div>
							<div className="card">
								<button onClick={() => handleCategoryChange('manual')}>
									<img src='/Book.png' alt="" />
								</button>
								<p>Capstone Manual</p>
							</div>
							<div className="card">
								<button>
									<img src='/Printer.png' alt="" />
								</button>
								<p>Printing Service</p>
							</div>
						</div>
					</section>
				)}
				
				<div>
					{showCards && getItemsToDisplay()}
				</div>
			</div>
		</div>
	)
}

export default Store