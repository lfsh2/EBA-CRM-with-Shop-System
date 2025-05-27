import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './CSS/Store.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faLocationDot, faChevronRight, faMagnifyingGlass, faMicrophone, faPlus, faCartShopping, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const Store = () => {
	const [message, setMessage] = useState('');
	const [formMessage, setFormMessage] = useState('');

	const [openModal, setOpenModal] = useState(false);
	const [formHide, setFormHide] = useState(false);
	
	const [carts, setCart] = useState([]);
	const token = localStorage.getItem('token');
	const navigateTo = useNavigate();

	const [query, setQuery] = useState('');
	const [results, setResults] = useState([]);

	const [showResult, setShowResult] = useState(false);
	const [exclusive, setExclusive] = useState([]);
	const [categories, setCategories] = useState([]);
	const [items, setItems] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [showSection, setShowSection] = useState(true);
	const [showCategorySection, setShowCategorySection] = useState(false);
	const [showVariant, setShowVariant] = useState(false);
	const [selectedItemId, setSelectedItemId] = useState(null);
	const [variant, setVariant] = useState([]);

	const [userId, setUserId] = useState('');
	const [category, setCategory] = useState('');
	const [image, setImage] = useState();
	const [itemName, setItemName] = useState('');
	const [variantName, setVariantName] = useState('');
	const [size, setSize] = useState('');
	const [quantity, setQuantity] = useState('');
	const [fullName, setFullName] = useState('');
	const [emailAddress, setEmailAddress] = useState('');
	const [phone, setPhone] = useState('');
	const [amount, setAmount] = useState('');

	const filteredItems = selectedCategory
	? items.filter(item => item.Category === selectedCategory)
	: [];

	useEffect(() => {
		if (!token) {
			window.location.href = '/userlogin';
			return;
		}
	
		const decodedToken = JSON.parse(atob(token.split('.')[1]));
		setFullName(decodedToken.fullname);
		setEmailAddress(decodedToken.email);
		setUserId(decodedToken.id);

		fetchCart();
	}, [token]);

	const fetchCart = () => {
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
            alert(err.response ? err.response.data.message : 'An error occurred');
			window.location.href = '/userlogin';
        });
	}

	const handleLogout = () => {
		localStorage.removeItem('token');
		
		navigateTo('/userlogin');
	};	

	useEffect(() => {
		fetchExclusive();
	}, []);

	const fetchExclusive = async () => {
		const response1 = await axios.get('http://localhost:3000/exclusive');
		setExclusive(response1.data);

		const response2 = await axios.get('http://localhost:3000/categories');
		setCategories(response2.data);

		const response3 = await axios.get('http://localhost:3000/store');
		setItems(response3.data);
	};

	useEffect(() => {
		const fetchData = async () => {
			if (query.trim() === '') {
				setResults([]);
				return;
			}

			try {
				const res = await axios.get(`http://localhost:3000/search?q=${query}`);
				setResults(res.data);
			} catch (err) {
				console.error('Search failed:', err);
			}
		};

		const delayDebounce = setTimeout(() => {
			fetchData();
		}, 300);

		return () => clearTimeout(delayDebounce);
	}, [query]);

	const handleSearch = (e) => {
		const value = e.target.value
		setQuery(value)

		if (value === '') {
			setShowCategorySection(false)
			setShowSection(true)
			setShowVariant(false)
		} else {
			setShowCategorySection(false)
			setShowSection(false)
			setShowVariant(false)
			setShowResult(true)
		}
	}

	useEffect(() => {
		if (selectedItemId) {
			axios.get(`http://localhost:3000/store/${selectedItemId}/variant`)
			.then(res => setVariant(res.data))
			.catch(err => console.error('Variant fetch error:', err));
		} else {
			setVariant([]);
		}
	}, [selectedItemId]);

	const handleCategory = (category) => {
		setSelectedCategory(category)
		setShowCategorySection(true)
		setShowSection(false)
	}
	const handleVariant = (variant) => {
		setSelectedItemId(variant.ID)

		if (selectedCategory === 'Capstone Manual' || selectedCategory === 'Module' || variant.Category === 'Capstone Manual' || variant.Category === 'Module') {
			setOpenModal(true);
			setFormHide(false);
			setCategory(variant.Category)
			setImage(variant.Image)
			setItemName(variant.Item_Name)
			setAmount(variant.Price)
		} else {
			setShowVariant(true)
			setShowResult(false)
			setShowCategorySection(false)
			setFormHide(true);
			setCategory(variant.Category)
			setImage(variant.Image)
			setItemName(variant.Item_Name)
			setAmount(variant.Price)
		}
	}

	const handleBack = () => {
		setOpenModal(null)
		setFormHide(null)
		setImage()
		setItemName('')
		setAmount('')
	}
	
	const handleForm = (item) => {
		setOpenModal(true);
		setImage(item.Image)
		setVariantName(item.Variant)
	}

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

		formData.append('UserID', userId);
		formData.append('Category', category);
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
				}, 2000);

				setOpenModal(false);
				fetchCart();

				setItemName('');
				setVariantName('');
				setSize('');
				setQuantity('');
				setPhone('');
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

		formData.append('UserID', userId);
		formData.append('Category', category);
		formData.append('ItemName', itemName);
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
				}, 2000);

				setOpenModal(false);
				fetchCart();

				setItemName('');
				setQuantity('');
				setPhone('');
			} else {
				console.log('failed submit')
			}
		} catch (error) {
			console.log('error submitting')
		}
	};
	
	return (
		<div className="store-container">
			{message && <div className='message'>{message}</div>}

			{openModal && (
				<div className="order-container">
					<div className="order-modal">
						<div className="title">
							<FontAwesomeIcon icon={faChevronLeft} className='icon' onClick={handleBack} />
							<h3>Order Form</h3>
						</div>
					
						<form onSubmit={(e) => e.preventDefault()}>
							<div className="input-container">
								<h4>Order Information</h4>
						
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
						
						
								{formHide && (
									<>
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
												placeholder='Enter size in centimeters'
												required
											/>
										</div>
								
									</>
								)}
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
										readOnly
									/>
								</div>
						
								<div className="input-block">
									<label>Email Address: </label>
									<input
										type="email"
										value={emailAddress}
										onChange={(e) => setEmailAddress(e.target.value)}
										placeholder='Enter your address'
										readOnly
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
					
							<button	type="button" onClick={formHide ? uniformFormValidation : itemFormValidation}>
								Place Order
							</button>
						</form>
					</div>
				</div>
			)}
			
			<div className="store">
				<header>
					<nav>
						<a href="/ebastore"><FontAwesomeIcon icon={faChevronLeft} className='icon'/> <h3>EBA Store</h3></a>

						<div className="group">
							<a href="/ebacart" className='cart'>
								<FontAwesomeIcon icon={faCartShopping} />
								<span>{carts.length}</span>
							</a>
							<button onClick={handleLogout}><FontAwesomeIcon icon={faArrowRightFromBracket} /></button>
						</div>
					</nav>
					
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
				</header>

				<section className="first-section">
					<FontAwesomeIcon icon={faMagnifyingGlass} className='search' />
					<input 
						type="text" 
						name="search" 
						id="search" 
						placeholder='Search product' 
						value={query}
						onChange={handleSearch}
						required />
					<FontAwesomeIcon icon={faMicrophone} className='mic' />
				</section>

				{showSection && (
					<>
						<section className="second-section">
							<div className="top">
								<h1>Exclusive Offer</h1>
							</div>

							<div className="card-block">
								{exclusive.map((exclusives, index) => (
									<div className="card" key={index}>
										<div className="group">
											<div className="img-block">
												<img src={`http://localhost:3000/ITEMS/${exclusives.Image}`} alt="" />
											</div>
											<div className="info">
												<h3>{exclusives.Item_Name}</h3>
												<p>S, M, L, XL</p>
											</div>
										</div>

										<div className="buttons">
											<p>Price may vary</p>
											<button onClick={() => handleCategory(exclusives.Category)}>
												<FontAwesomeIcon icon={faPlus} />
											</button>
										</div>
									</div>
								))}
							</div>
						</section>

						<section className="third-section">
							<h1>Categories</h1>
							<div className="card-block">
								{categories.map(categories => (
									<div className="card">
										<button 
										onClick={() => handleCategory(categories.Category)}
										>
											<img src={`http://localhost:3000/ITEMS/${categories.Image}`} alt="" />
										</button>
										<p>{categories.Category}</p>
									</div>
								))}
							</div>
						</section>
					</>
				)}

				{showCategorySection && (
					<section className="fourth-section 1">
						{filteredItems.map(item => (
							<div className="card" key={item.ID} onClick={() => handleVariant(item)}>
								<img src={`http://localhost:3000/ITEMS/${item.Image}`} alt="" />

								<div className="name">
									<h3>{item.Item_Name}</h3>
								</div>
							</div>
						))}
					</section>
				)}
				{showVariant && (
					<section className="fourth-section 2">
						{variant.map((variants, index) => (
						<div className="card" key={index} onClick={() => handleForm(variants)}>
							<img src={`http://localhost:3000/ITEMS/${variants.Image}`} alt="" />
							<div className="name">
								<h3>{variants.Variant}</h3>
							</div>
						</div>
						))}
					</section>
				)}

				{showResult && (
					<div className="fourth-section 3">
						{results.map((result, index) => (
							<div className="card" key={index} onClick={() => handleVariant(result)}>
								<img src={`http://localhost:3000/ITEMS/${result.Image}`} alt="" />

								<div className="name">
									<h3>{result.Item_Name}</h3>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default Store