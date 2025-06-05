import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faPlus } from '@fortawesome/free-solid-svg-icons';

const Pages = () => {
	const [exclusive, setExclusive] = useState([])
	const [storeCategories, setStoreCategories] = useState([])
	const [store, setStore] = useState([])
	const [activeSection, setActiveSection] = useState('Exclusive');
	const [editItem, setEditItem] = useState(null);
	const [showEditForm, setShowEditForm] = useState(false);
	
	const [image, setImage] = useState('')
	const [category, setCategory] = useState('')
	const [itemName, setItemName] = useState('')
	const [price, setPrice] = useState('')
	const [formData, setFormData] = useState({
		Category: '',
		Item_Name: '',
		Price: ''
	});

	const [message, setMessage] = useState('')
	const [formMessage, setFormMessage] = useState('')
	const [openAddItem, setOpenAddItem] = useState(false)
	const [confirmation, setConfirmation] = useState(false);
	const [msg, setMsg] = useState('');
	const [IDRemove, setIDRemove] = useState('');

	useEffect(() => {
		fetchData();	
	})

	const fetchData = async () => {
        const exclusiveData = await axios.get('http://localhost:3000/exclusive');
        setExclusive(exclusiveData.data);
		
        const storeCategoriesData = await axios.get('http://localhost:3000/storecategories');
        setStoreCategories(storeCategoriesData.data);

		const storeData = await axios.get('http://localhost:3000/store');
		setStore(storeData.data);
	}

	const handleSectionClick = (section) => {
		setActiveSection(section);
	}

	const handleAddClick = (e) => {
		e.preventDefault();

		setMsg('add')
		setConfirmation(prev => !prev)
		setOpenAddItem(false);
	}
	const handleEditClick = () => {
		setMsg('edit')
		setConfirmation(prev => !prev)
		setShowEditForm(false);
	}
	const handleRemoveClick = (id) => {
		setMsg('remove')
		setConfirmation(prev => !prev)
		setIDRemove(id)
	}
	
	const handleConfirm = () => {
		setConfirmation(prev => !prev)
		
		if (msg === 'add') {
			handleAddItem()
		} else if (msg === 'edit') {
			handleUpdate();
		} else if (msg === 'remove') {
			handleRemove(IDRemove)
		}
	}
	const handleCancel = () => {
		setMsg('')
		setConfirmation(prev => !prev)
	}
	
    const handleFile = (e) => {
        setImage(e.target.files[0])
    }

	const handleEdit = (store) => {
		setEditItem(store)
		setShowEditForm(prev => !prev)
		
        setFormData({ 
            category: store.Category,
            itemName: store.Item_Name,
            price: store.Price
        });
	}

	const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

	const handleAddItem = () => {
        const formData = new FormData();
		
		formData.append('store', image);
        formData.append('Category', category);
        formData.append('ItemName', itemName);
        formData.append('Price', price);

		let api = ''

		if (activeSection === 'Exclusive') {
			api = `http://localhost:3000/addexclusive`
		} else if (activeSection === 'Categories') {
			api = `http://localhost:3000/addcategories`
		} else if (activeSection === 'Store Items') {
			api = `http://localhost:3000/addstore`
		}

        axios.post(api, formData)
        .then(res => {
			setOpenAddItem(false)
			setMessage("Item added successfully");
			setTimeout(() => {
				setMessage('');
			}, 2000);

			fetchData();
			
			setItemName('');
			setPrice('');
        })
        .catch(err => {
            setFormMessage('Please fill all field')
            
            setTimeout(() => {
                setFormMessage('');
            }, 2000);
        });
	}
	
    const handleUpdate = async () => {	
        const formdata = new FormData();
    
        if (image) {
            formdata.append('store', image);
        }
    
        formdata.append('category', formdata.category);
        formdata.append('itemName', formData.itemName);
        formdata.append('price', formData.price);

		let api = ''

		if (activeSection === 'Exclusive') {
			api = `http://localhost:3000/exclusive/${editItem.ID}`
		} else if (activeSection === 'Categories') {
			api = `http://localhost:3000/storecategories/${editItem.ID}`
		} else if (activeSection === 'Store Items') {
			api = `http://localhost:3000/store/${editItem.ID}`
		}
    
        try {
            const response = await axios.put(api, formdata);
			setEditItem(null);
			
			setMessage("Item edited successfully");
			setTimeout(() => {
				setMessage('');
			}, 2000);
			fetchData();
        } catch (err) {
            setFormMessage('Please fill all field')
            
            setTimeout(() => {
                setFormMessage('');
            }, 2000);
        }
    };
	
    const handleRemove = async (id) => {
		let api = ''

		if (activeSection === 'Exclusive') {
			api = `http://localhost:3000/exclusive/${id}`	
		} else if (activeSection === 'Categories') {
			api = `http://localhost:3000/storecategories/${id}`
		} else if (activeSection === 'Store Items') {
			api = `http://localhost:3000/store/${id}`
		}
        await axios.delete(api);
        setExclusive(exclusive.filter(exclusive => exclusive.id !== id));
        setCategories(categories.filter(categories => categories.id !== id));
        setStore(store.filter(store => store!== id));
    
        setMessage("Item deleted successfully");
        setTimeout(() => {
            setMessage('');
        }, 2000);
        
        fetchData();
    };

	return (
		<div className="admin-content">
			<h1>Pages</h1>

			<div className="pages main-content">
				<div className="section-btn">
					<button onClick={() => handleSectionClick('Exclusive')}>Exclusive Section</button>
					<button onClick={() => handleSectionClick('Categories')}>Categories Section</button>
					<button onClick={() => handleSectionClick('Store Items')}>Store Items Section</button>
				</div>

				{confirmation && (
					<div className="modal-container">
						<div className="confirmation">
							<p>Are you sure you want to {msg} item?</p>
							<div className="btn">
								<button onClick={handleConfirm}>Yes</button>
								<button onClick={handleCancel}>No</button>
							</div>
						</div>
					</div>
				)}

				<div className="section-container">
					{activeSection === 'Exclusive' && (
						<div className="exclusive-section">
							<h2>Exclusive Section</h2>

							<div className="fourth-section">
								<div className="card" onClick={() => setOpenAddItem(prev => !prev)}>
									<FontAwesomeIcon icon={faPlus} className='icon' />
								</div>

								{exclusive.map((exclusive, index) => (
									<div className="card" key={index}>
										<img src={`http://localhost:3000/ITEMS/${exclusive.Image}`} alt="" />

										<div className="name">
											<h3>{exclusive.Item_Name}</h3>
										</div>

										<div className="btn">
											<button onClick={() => handleEdit(exclusive)}>Edit Item</button>
											<button onClick={() => handleRemoveClick(exclusive.ID)}>Remove</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
					{activeSection === 'Categories' && (
						<div className="category-section">
							<h2>Categories Section</h2>
							
							<div className="fourth-section">
								<div className="card" onClick={() => setOpenAddItem(prev => !prev)}>
									<FontAwesomeIcon icon={faPlus} className='icon' />
								</div>

								{storeCategories.map((categories, index) => (
									<div className="card" key={index}>
										<img src={`http://localhost:3000/ITEMS/${categories.Image}`} alt="" />

										<div className="name">
											<h3>{categories.Item_Name}</h3>
										</div>
										
										<div className="btn">
											<button onClick={() => handleEdit(categories)}>Edit Item</button>
											<button onClick={() => handleRemove(categories.ID)}>Remove</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
					{activeSection === 'Store Items' && (
						<div className="store-items">
							<h2>Store Items Section</h2>

							<div className="fourth-section">
								<div className="card" onClick={() => setOpenAddItem(prev => !prev)}>
									<FontAwesomeIcon icon={faPlus} className='icon' />
								</div>

								{store.map((store, index) => (
									<div className="card" key={index}>
										<img src={`http://localhost:3000/ITEMS/${store.Image}`} alt="" />

										<div className="name">
											<h3>{store.Item_Name}</h3>
											<p>Price: {store.Price}</p>
										</div>

										<div className="btn">
											<button onClick={() => handleEdit(store)}>Edit Item</button>
											<button onClick={() => handleRemove(store.ID)}>Remove</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{message && <div className='messages'>{message}</div>}

					{openAddItem && (
						<div className="modal-container">
							<div className="modal">
								<div className="title">
									<FontAwesomeIcon icon={faChevronLeft} className='icon' onClick={() => setOpenAddItem(null)}/>
									<h3>Add Item</h3>
								</div>

								<form onSubmit={handleAddClick}>
									<div className="input-block">
										<label>Image:</label>
										<input 
											type="file" 
											onChange={handleFile}
										/>
									</div>
									<div className="input-block">
										<label>Category:</label>
										<select
											value={category} 
											onChange={(e) => setCategory(e.target.value)}
											required 
										>
											<option value="" disabled>Select Category</option>
											{storeCategories.map((category, index) => (
												<option key={index} value={category.Category}>{category.Category}</option>
											))}
										</select>
									</div>
									<div className="input-block">
										<label>Item Name:</label>
										<input
											type="text" 
											value={itemName}
                                        	onChange={(e) => setItemName(e.target.value)}
											placeholder='Enter Item Name'
											required
											/>
									</div>

									{activeSection === 'Store Items' && (
										<div className="input-block">
											<label>Price:</label>
											<input
												type="number" 
												value={price}
												placeholder='Enter Price'
												onChange={(e) => setPrice(e.target.value)}
												required
											/>
										</div>
									)} 

                                	{formMessage && <div className='form-message'>{formMessage}</div>}

                                	<button type="submit">Add Item</button>
								</form>
							</div>
						</div>
					)}

					{showEditForm && editItem && (
						<div className="modal-container">
							<div className="modal">
								<div className="title">
									<FontAwesomeIcon icon={faChevronLeft} className='icon' onClick={() => setEditItem(null)}/>
									<h3>Edit Item</h3>
								</div>

								<form>
									<div className="input-block">
										<label>Image:</label>
										<input 
											type="file" 
											onChange={handleFile}
										/>
									</div>
									<div className="input-block">
										<label>Category:</label>
										<select
											value={formData.category}  
                                        	name='category'
											onChange={handleChange}
											required 
										>
											<option value="" disabled>Select Category</option>
											{storeCategories.map((category, index) => (
												<option key={index} value={category.Category}>{category.Category}</option>
											))}
										</select>
									</div>
									<div className="input-block">
										<label>Item Name:</label>
										<input
											type="text" 
											name="itemName"
											value={formData.itemName}
                                        	onChange={handleChange}
											required
										/>
									</div>

									{activeSection === 'Store Items' && (
										<div className="input-block">
											<label>Price:</label>
											<input
												type="number" 
												name="price"
												value={formData.price}
												onChange={handleChange}
												required
											/>
										</div>
									)} 

                                	{formMessage && <div className='form-message'>{formMessage}</div>}

                                	<button type="button" onClick={handleEditClick}>Edit Item</button>
								</form>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Pages
