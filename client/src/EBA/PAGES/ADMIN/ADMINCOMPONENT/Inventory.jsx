import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faClipboardList, faRotateRight } from '@fortawesome/free-solid-svg-icons';

const Inventory = () => {
    const [inventories, setInventories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [confirmation, setConfirmation] = useState(false);
    const [msg, setMsg] = useState('');
    const [IDRemove, setIDRemove] = useState('');
    
    const [openForm, setOpenForm] = useState(false);
    const [addingInventory, setAddingInventory] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selection, setSelection] = useState(null);

    const [form, setForm] = useState(true);

    const [image, setImage] = useState();
    const [category, setCategory] = useState('');
    const [itemName, setItemName] = useState('');
    const [variant, setVariant] = useState('');
    const [size, setSize] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [message, setMessage] = useState('');
    const [formMessage, setFormMessage] = useState('');

    const [showEditForm, setShowEditForm] = useState(false);
    const [editingInventory, setEditingInventory] = useState(null);
    const [formData, setFormData] = useState({ 
        Category: '', 
        Item_Name: '', 
        Variant: '', 
        Size: '', 
        Quantity: '', 
        Price: '', 
    });

    const openUnifShi = () => {
        setForm(true)
        setAddingInventory('uniform');
        setOpenForm(!openForm)
		setSelection('Student Uniform')
    }
    const openModMan = () => {
        setForm(false)
        setAddingInventory('module');
        setOpenForm(!openForm)
		setSelection('Module')
    }

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const inventoryResponse = await axios.get('http://localhost:3000/inventory');
        setInventories(inventoryResponse.data);

        const categoryResponse = await axios.get('http://localhost:3000/exclusive');
        setCategories(categoryResponse.data);
    };

	const handleAddClick = (e) => {
		e.preventDefault();

		setMsg('add')
		setConfirmation(prev => !prev)
		setAddingInventory(false);
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
			createInventory()
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

    const filteredInventories = selectedCategory === "All" 
    ? inventories 
    : inventories.filter(inventory => inventory.Category === selectedCategory);
    
    const handleFile = (e) => {
        setImage(e.target.files[0])
    }

    const createInventory = () => {
        const formData = new FormData();
        formData.append('inventory', image);
    
        formData.append('Category', category);
        formData.append('ItemName', itemName);
        formData.append('Variant', variant);
        formData.append('Size', size);
        formData.append('Quantity', quantity);
        formData.append('Price', price);
    
        axios.post('http://localhost:3000/inventory', formData)
        .then(res => {
            if (res.data.Status === "Success") {
                setMessage("Inventory added successfully");
                setTimeout(() => {
                    setMessage('');
                }, 2000);

                setAddingInventory(false);
                fetchData();
                
                setCategory('');
                setItemName('');
                setVariant('');
                setSize('');
                setQuantity('');
                setPrice('');
            } else {
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

    const handleEdit = (inventory) => {
        setEditingInventory(inventory);
		setShowEditForm(prev => !prev)

        if (inventory.Category === 'Student Uniform' || inventory.Category === 'Department Shirt' || inventory.Category === 'Organizational Shirt') {
            setForm(true)
			setSelection('Student Uniform')
        } else {
			setForm(false)
			setSelection('Module')
        }

        setFormData({ 
            category: inventory.Category, 
            itemName: inventory.Item_Name, 
            variant: inventory.Variant, 
            size: inventory.Size, 
            quantity: inventory.Quantity, 
            price: inventory.Price, 
        });
    };

    const handleUpdate = async () => {
        const formdata = new FormData();
    
        if (image) {
            formdata.append('inventory', image);
        }
    
        formdata.append('category', formData.category);
        formdata.append('itemName', formData.itemName);
        formdata.append('variant', formData.variant);
        formdata.append('size', formData.size);
        formdata.append('quantity', formData.quantity);
        formdata.append('price', formData.price);
    
        try {
            const response = await axios.put(`http://localhost:3000/inventory/${editingInventory.ID}`, formdata);
    
            if (response.data.Status === "Success") {
                setInventories(inventories.map(inventory => 
                    inventory.ID === editingInventory.ID 
                    ? { ...inventory, ...formData, Image: response.data.updatedImage }
                    : inventory
                ));
            } else {
                setEditingInventory(null);
                
                setMessage("Inventory edited successfully");
                setTimeout(() => {
                    setMessage('');
                }, 2000);

                fetchData();
            }
        } catch (err) {
            setFormMessage('Please fill all field')
            
            setTimeout(() => {
                setFormMessage('');
            }, 2000);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRemove = async (id) => {
        await axios.delete(`http://localhost:3000/inventory/${id}`);
        setInventories(inventories.filter(inventory => inventory.id !== id));
        
        setMessage("Inventory deleted successfully");
        setTimeout(() => {
            setMessage('');
        }, 2000);
        
        fetchData();
    };

    const refresh = () => {
        fetchData();
    }

    return (
        <div className="admin-content">
            <h1>Inventory</h1>
            
            <div className="inventory main-content">
                <div className="top">
                    <select 
                        onChange={(e) => setSelectedCategory(e.target.value)}    
                        value={selectedCategory}                
                    >
                        <option value="All">Category: All</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category.Category}>Category: {category.Category}</option>
                        ))}
                    </select>
                    <button onClick={() => setOpenForm(!openForm)} className='button'><FontAwesomeIcon icon={faClipboardList} /></button>
                    {openForm && (
                        <div className="modal-container">
                            <div className="modal modals">
                                <button onClick={openUnifShi} className='button'>Add Uniform/Shirt</button>
                                <button onClick={openModMan} className='button'>Add Module/Manual</button>
                            </div>
                        </div>
                    )}
                    <button><FontAwesomeIcon icon={faRotateRight} onClick={refresh} className='icon' /></button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Item Name</th>
                            <th>Variant</th>
                            <th>Size</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredInventories.length === 0 ? (
                            <tr><td><h3 className='no'>No Inventories</h3></td></tr>
                        ) : (
                            <>
                                {filteredInventories.map(inventory => (
                                    <tr key={inventory.ID}>
                                        <td><img src={`http://localhost:3000/ITEMS/${inventory.Image}`} alt="" /></td>
                                        <td>{inventory.Item_Name}</td>
                                        <td>{inventory.Variant || '-'}</td>
                                        <td>{inventory.Size || '-'}</td>
                                        <td>{inventory.Quantity}</td>
                                        <td>₱{inventory.Price}</td>
                                        <td className='btn'>
                                            <button onClick={() => handleEdit(inventory)}>Edit</button>
                                            <button onClick={() => handleRemoveClick(inventory.ID)}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </>
                        )}
                    </tbody>
                </table>
                
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

                {message && <div className='messages'>{message}</div>}

                {addingInventory && (
                    <div className="modal-container">
                        <div className="inventories modal">
                            <div className="title">
                                <FontAwesomeIcon icon={faChevronLeft} className='icon' onClick={() => setAddingInventory(null)}/>
                                <h3>Add Inventory</h3>
                            </div>

                            <form onSubmit={handleAddClick}>
                                <div className="input-block">
                                    <label>Image:</label>
                                    <input 
                                        type="file" 
                                        onChange={handleFile}
                                        required
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
										{categories
											.filter((category) => {
												if (selection === 'Module') {
													return ['Module', 'Capstone Manual'].includes(category.Category);
												} else if (selection === 'Student Uniform') {
													return ['Student Uniform', 'Department Shirt', 'Organizational Shirt'].includes(category.Category);
												}
												return false
											})
											.map((category, index) => (
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
                                {form && (
                                    <>
                                        <div className="input-block">
                                            <label>Variant:</label>
                                            <input
                                                type="text"
                                                value={variant} 
                                                onChange={(e) => setVariant(e.target.value)}
                                                placeholder='Enter Variant'
                                                required 
                                            />
                                        </div>
                                        <div className="input-block">
                                            <label>Size:</label>
                                            <select
                                                value={size} 
                                                onChange={(e) => setSize(e.target.value)}
                                                required 
                                            >
                                                <option value="" selected disabled>Select Size</option>
                                                <option value="Small">Small</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Large">Large</option>
                                                <option value="Extra Large">Extra Large</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                                <div className="input-block">
                                    <label>Quantity:</label>
                                    <input 
                                        type="number"
                                        value={quantity} 
                                        onChange={(e) => setQuantity(e.target.value)}
                                        placeholder='Enter Quantity'
                                        required 
                                    />
                                </div>
                                <div className="input-block">
                                    <label>Price:</label>
                                    <input 
                                        type="number"
                                        value={price} 
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder='Enter Price'
                                        required 
                                    />
                                </div>

                                {formMessage && <div className='form-message'>{formMessage}</div>}

                                <button type="submit">Add</button>
                            </form>
                        </div>
                    </div>
                )}
                {showEditForm && editingInventory && (
                    <div className="modal-container">
                        <div className="inventories modal">
                            <div className="title">
                                <FontAwesomeIcon icon={faChevronLeft} className='icon' onClick={() => setEditingInventory(null)}/>
                                <h3>Edit Inventory</h3>
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
                                        <option value="" selected disabled>Select Category</option>
										{categories
											.filter((category) => {
												if (selection === 'Module') {
													return ['Module', 'Capstone Manual'].includes(category.Category);
												} else if (selection === 'Student Uniform') {
													return ['Student Uniform', 'Department Shirt', 'Organizational Shirt'].includes(category.Category);
												}
												return false
											})
											.map((category, index) => (
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
                                {form && (
                                    <>
                                        <div className="input-block">
                                            <label>Variant:</label>
                                            <select
                                                value={formData.variant} 
                                                name='variant'
                                                onChange={handleChange}
                                                required 
                                            >
                                                <option value="" selected disabled>Select Variant</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                        <div className="input-block">
                                            <label>Size:</label>
                                            <select
                                                value={formData.size} 
                                                name='size'
                                                onChange={handleChange}
                                                required 
                                            >
                                                <option value="" selected disabled>Select Size</option>
                                                <option value="Small">Small</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Large">Large</option>
                                                <option value="Extra Large">Extra Large</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                                <div className="input-block">
                                    <label>Quantity:</label>
                                    <input 
                                        type="number" 
                                        name="quantity"
                                        value={formData.quantity} 
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
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

                                {formMessage && <div className='form-message'>{formMessage}</div>}

                                <button type="button" onClick={handleEditClick}>Edit</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Inventory;
