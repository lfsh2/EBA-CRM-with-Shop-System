	import React, { useEffect, useState } from 'react'
	import axios from 'axios';

	import Dates from './Date'
	import '../CSS/Admin.css'
	import SalesChart from './SalesChart';
	import OrderChart from './OrderChart';

	const Dashboard = () => {
		const [transactions, setTransactions] = useState([]);
		const [transactionAmount, setTransactionAmount] = useState(0);
		const [transactionQuantity, setTransactionQuantity] = useState(0);
		const [inventories, setInventory] = useState([]);
		const [inventoryQuantity, setInventoryQuantity] = useState(0);
		const [lowStockItems, setLowStockItems] = useState([]);
		const [newOrdersThisWeek, setNewOrdersThisWeek] = useState(0);
		const [fastMovingItems, setFastMovingItems] = useState([]);

		useEffect(() => {
			fetchData();
		}, []);

		const fetchData = async () => {
			try {
				const responseTransaction = await axios.get('http://localhost:3000/transaction');
				const transactionsData = responseTransaction.data;
				setTransactions(transactionsData);

				const totalSales = transactionsData.reduce((acc, transaction) => acc + transaction.Amount, 0);
				setTransactionAmount(totalSales);

				const totalOrders = transactionsData.reduce((acc, transaction) => acc + transaction.Quantity, 0);
				setTransactionQuantity(totalOrders);

				const oneWeekAgo = new Date();
				oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
				const newOrders = transactionsData.filter(transaction => 
					new Date(transaction.Date) >= oneWeekAgo
				).length;
				setNewOrdersThisWeek(newOrders);

				const itemCounts = transactionsData.reduce((acc, transaction) => {
					acc[transaction.Item_Name] = (acc[transaction.Item_Name] || 0) + transaction.Quantity;
					return acc;
				}, {});
				
				const fastMoving = Object.entries(itemCounts)
					.sort(([,a], [,b]) => b - a)
					.slice(0, 3)
					.map(([name, count]) => ({ name, count }));
				setFastMovingItems(fastMoving);

				const updatedTransactions = transactionsData.map(transaction => ({
					...transaction,
					SizeAbbreviation: getSizeAbbreviation(transaction.Size),
				}));
				setTransactions(updatedTransactions);

				const responseInventory = await axios.get('http://localhost:3000/inventory');
				const inventoriesData = responseInventory.data.map(inventory => ({
					...inventory,
					SizeAbbreviation: getSizeAbbreviation(inventory.Size),
				}));
				setInventory(inventoriesData);

				const totalInventory = inventoriesData.reduce((acc, inventory) => acc + inventory.Quantity, 0);
				setInventoryQuantity(totalInventory);

				const lowStock = inventoriesData.filter(item => item.Quantity < 11);
				setLowStockItems(lowStock);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
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

		const formatCurrency = (amount) => {
			return new Intl.NumberFormat('en-US', { 
				style: 'currency', 
				currency: 'PHP',
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			}).format(amount);
		};

		return (
			<div className="admin-content">
				<h1>Dashboard</h1>

				<div className="dashboard main-content">
					<Dates />

					<div className="top">
						<div className="card">
							<p>Total Sales</p>
							<h2>{formatCurrency(transactionAmount)}</h2>
						</div>
						<div className="card">
							<p>Total Orders</p>
							<h2>{transactionQuantity}</h2>
						</div>
						<div className="card"> 
							<p>Low Stocks Item</p>
							<h2>{lowStockItems.length}</h2>
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
							<p>New Orders This Week</p>
							<h2>{newOrdersThisWeek}</h2>
						</div>
						<div className="card">
							<p>Fast Moving Items</p>
							<h2>{fastMovingItems.length > 0 ? fastMovingItems[0].name : 'No data'}</h2>
						</div>
						<div className="card">
							<p>Total Transaction</p>
							<h2>{transactions.length}</h2>
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
											{transactions.slice(0, 5).map((transaction, index) => (
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

						<div className="card cards">
							<div className="orders-card">
								<h2>Pending Claims</h2>

								<div className="pending-block">
									{transactions.filter(t => t.Status === 'Pending').map((transaction, index) => (
										<div key={index} className="pending">
											<p>{transaction.Customer_Name}</p>
											-
											<p>{transaction.Item_Name}</p>
											{transaction.Item_Name !== 'Capstone Manual' && transaction.Item_Name !== 'Modules' && (
												<>
													-
													<p>{transaction.SizeAbbreviation}</p>
												</>
											)} 
										</div>
									))}
								</div>
							</div>

							<div className="orders-card">
								<h2>Low Stock Item</h2>

								<div className="pending-block">
									{lowStockItems.length === 0 ? (
										<p>No low stock items</p>
									) : (
										lowStockItems.map((inventory, index) => (
											<div key={index} className="pending">
												<p>{inventory.Item_Name}</p>
												-
												<p>{inventory.Variant}</p>
												-
												<p>{inventory.SizeAbbreviation}</p>
												-
												<p>{inventory.Quantity} left</p>
											</div>
										))
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	export default Dashboard