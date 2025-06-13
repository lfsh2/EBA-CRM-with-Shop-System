import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';

const Inventory = () => {
    const [inventories, setInventories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const inventoryResponse = await axios.get('http://localhost:3000/inventory');
        setInventories(inventoryResponse.data);

        const categoryResponse = await axios.get('http://localhost:3000/exclusive');
        setCategories(categoryResponse.data);
    };
    const filteredInventories = selectedCategory === "All" 
    ? inventories 
    : inventories.filter(inventory => inventory.Category === selectedCategory);

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
                                    </tr>
                                ))}
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Inventory;
