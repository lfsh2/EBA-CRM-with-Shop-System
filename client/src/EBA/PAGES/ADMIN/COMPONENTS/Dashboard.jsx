import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import Dates from './Date'
import '../CSS/Admin.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
	const [dashboardData, setDashboardData] = useState({
		totalSales: 0,
		totalOrders: 0,
		lowStockItems: 0,
		availableStocks: 0,
		newOrders: 0,
		fastMovingItems: [],
		salesChartData: null,
		ordersChartData: null
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			
			const response = await axios.get('http://localhost:3000/api/dashboard/all');
			console.log('Dashboard Data:', response.data);
			
			setDashboardData({
				totalSales: response.data.totalSales.total_sales,
				totalOrders: response.data.totalOrders.total_orders,
				lowStockItems: response.data.lowStock.low_stock,
				availableStocks: response.data.availableStocks.total_stocks,
				newOrders: response.data.newOrders.new_orders,
				fastMovingItems: response.data.fastMovingItems,
				salesChartData: response.data.salesData,
				ordersChartData: response.data.ordersData
			});
		} catch (error) {
			console.error('Error fetching dashboard data:', error);
			if (error.response) {
				console.error('Error response:', error.response.data);
				console.error('Error status:', error.response.status);
			}
			setError('Failed to load dashboard data. Please try again later.');
		} finally {
			setLoading(false);
		}
	};

	const chartOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
			},
			title: {
				display: true,
				text: 'Monthly Data',
			},
		},
	};

	if (loading) {
		return (
			<div className="admin-content">
				<div className="loading">Loading dashboard data...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="admin-content">
				<div className="error">{error}</div>
				<button onClick={fetchData}>Retry</button>
			</div>
		);
	}

	return (
		<div className="admin-content">
			<h1>Dashboard</h1>

			<div className="dashboard main-content">
				<Dates />

				<div className="top">
					<div className="card">
						<p>Total Sales</p>
						<h2>₱{Number(dashboardData.totalSales).toLocaleString()}</h2>
					</div>
					<div className="card">
						<p>Total Orders</p>
						<h2>{Number(dashboardData.totalOrders).toLocaleString()}</h2>
					</div>
					<div className="card"> 
						<p>Low Stocks Item</p>
						<h2>{Number(dashboardData.lowStockItems).toLocaleString()}</h2>
					</div>
					<div className="card">
						<p>Available Stocks</p>
						<h2>{Number(dashboardData.availableStocks).toLocaleString()}</h2>
					</div>
				</div>

				<div className="graph">
					<div className="card">
						<h2>Sales</h2>
						{dashboardData.salesChartData && (
							<Line
								options={chartOptions}
								data={dashboardData.salesChartData}
							/>
						)}
					</div>
					
					<div className="card">
						<h2>Total Orders</h2>
						{dashboardData.ordersChartData && (
							<Line
								options={chartOptions}
								data={dashboardData.ordersChartData}
							/>
						)}
					</div>
				</div>
				
				<div className="top">
					<div className="card">
						<p>New Orders of the Week</p>
						<h2>{Number(dashboardData.newOrders).toLocaleString()}</h2>
					</div>
					<div className="card">
						<p>Fast Moving Items</p>
						<div className="fast-moving-items">
							{dashboardData.fastMovingItems.map((item, index) => (
								<div key={index} className="fast-moving-item">
									<span>{item.Item_Name}</span>
									<span>{item.order_count} orders</span>
								</div>
							))}
						</div>
					</div>
					<div className="card">
						<p>Total Transaction</p>
						<h2>₱{Number(dashboardData.totalSales).toLocaleString()}</h2>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Dashboard