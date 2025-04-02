import React, { useEffect, useState } from 'react'
import axios from 'axios';

import Dates from './Date'
import '../CSS/Admin.css'
import SalesChart from './SalesChart';
import OrderChart from './OrderChart';

const Dashboard = () => {
	const [transactions, setTransactions] = useState([]);
	const [transactionAmount, setTransactionAmount] = useState(0);
	const [inventories, setInventory] = useState([]);
	const [inventoryQuantity, setInventoryQuantity] = useState(0);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
        const responseTransaction = await axios.get('http://localhost:3000/transaction');
        setTransactions(responseTransaction.data);

		const sumTransaction = responseTransaction.data.reduce((acc, transaction) => acc + transaction.Amount, 0);
        setTransactionAmount(sumTransaction);  

		const updatedTransactions = responseTransaction.data.map(transaction => ({
			...transaction,
			SizeAbbreviation: getSizeAbbreviation(transaction.Size),
		}));
		setTransactions(updatedTransactions);


        const responseInventory = await axios.get('http://localhost:3000/inventory');
        setInventory(responseInventory.data);

		const sumInventory = responseInventory.data.reduce((acc, inventory) => acc + inventory.Quantity, 0);
        setInventoryQuantity(sumInventory);
		
		const updatedInventories = responseInventory.data.map(inventory => ({
			...inventory,
			SizeAbbreviation: getSizeAbbreviation(inventory.Size),
		}));
		setInventory(updatedInventories);
    };

	const getSizeAbbreviation = (size) => {
		switch (size) {
			case 'Small':
				return 'S';
			case 'Medium':
				return 'M';
			case 'Large':
				return 'L';
			case 'Xtra Large':
				return 'XL';
			default:
				return size; 
		}
	};
    
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

	return (
		<div className="admin-content">
			<h1>Dashboard</h1>

			<div className="dashboard main-content">
				<Dates />

				<div className="top">
					<div className="card">
						<p>Total Sales</p>
						<h2>₱{transactionAmount}</h2>
					</div>
					<div className="card">
						<p>Total Orders</p>
						<h2>{transactions.length}</h2>
					</div>
					<div className="card"> 
						<p>Low Stocks Item</p>
						<h2>5</h2>
					</div>
					<div className="card">
						<p>Available Stocks</p>
						<h2>{inventoryQuantity}</h2>
					</div>
				</div>

				<div className="graph">
					<div className="card">
						<h2>Sales</h2>
						<SalesChart />
					</div>
					
					<div className="card">
						<h2>Total Order</h2>
						<OrderChart />
					</div>
				</div>
				
				<div className="top">
					<div className="card">
						<p>New Order of the Week</p>
						<h2>wala pa</h2>
					</div>
					<div className="card">
						<p>Fast Moving Items</p>
						<h2>wala pa</h2>
					</div>
					<div className="card">
						<p>Total Transaction</p>
						<h2>{transactionAmount}</h2>
					</div>
				</div>

				<div className="graph graphs">
					<div className="card orders">
						<h2>New Orders</h2>

						<table>
							<thead>
								<tr>
									<th>Student Name</th>
									<th>Quantity</th>
									<th>Item Name</th>
									<th>Date</th>
								</tr>
							</thead>

							<tbody>
								{transactions.length === 0 ? (
									<tr>
                                        <th><h3 className='no'>No Transaction</h3></th>
									</tr>
								) : (
									<>
										{transactions.map((transaction, index) => (
											<tr key={index}>
												<td>{transaction.Customer_Name}</td>
												<td>{transaction.Quantity}</td>
												<td>{transaction.Item_Name}</td>
												<td>{formatDate(transaction.Date)}</td>
											</tr>
										))}
									</>
								)}
							</tbody>
						</table>
					</div>

					<div className="card orders-card">
						<h2>Pending Claims</h2>

						<div className="pending-block">
							{transactions.map((transaction, index) => (
								<div key={index} className="pending">
									<p>202109999</p>
									-
									<p>{transaction.Item_Name}</p>
									-
									<p>{transaction.SizeAbbreviation}</p>
								</div>
							))}
						</div>
					</div>

					<div className="card orders-card">
						<h2>Low Stock Item</h2>

						<div className="pending-block">
							{inventories.map((inventory, index) => (
								<div key={index} className="pending">
									<p>{inventory.Item_Name} </p>
									-
									<p>{inventory.Variant}</p>
									-
									<p>{inventory.SizeAbbreviation}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Dashboard