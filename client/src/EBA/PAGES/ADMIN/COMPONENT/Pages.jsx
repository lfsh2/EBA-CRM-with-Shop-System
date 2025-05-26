import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Pages = () => {
	const [exclusive, setExclusive] = useState([])
	const [store, setStore] = useState([])

	useEffect(() => {
		fetchData();	
	})

	const fetchData = async () => {
        const exclusiveData = await axios.get('http://localhost:3000/exclusive');
        setExclusive(exclusiveData.data);

		const storeData = await axios.get('http://localhost:3000/store');
		setStore(storeData.data);
	}

	return (
		<div className="admin-content">
			<h1>Pages</h1>

			<div className="pages main-content">
				<div className="exclusive-section">
					<h2>Exclusive Section</h2>

					<div className="fourth-section">
						{exclusive.map((exclusive, index) => (
							<div className="card" key={index}>
								<img src={`http://localhost:3000/ITEMS/${exclusive.Image}`} alt="" />

								<div className="name">
									<h3>{exclusive.Item_Name}</h3>
								</div>

								<button>Edit</button>
							</div>
						))}
					</div>
				</div>

				<div className="category-section">
					<h2>Categories Section</h2>
					
					<div className="fourth-section">
						{exclusive.map((exclusive, index) => (
							<div className="card" key={index}>
								<img src={`http://localhost:3000/ITEMS/${exclusive.Image}`} alt="" />

								<div className="name">
									<h3>{exclusive.Item_Name}</h3>
								</div>

								<button>Edit</button>
							</div>
						))}
					</div>
				</div>

				<div className="store-items">
					<h2>Store Items</h2>

					<div className="fourth-section">
						{store.map((store, index) => (
							<div className="card" key={index}>
								<img src={`http://localhost:3000/ITEMS/${store.Image}`} alt="" />

								<div className="name">
									<h3>{store.Item_Name}</h3>
								</div>

								<button>Edit</button>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Pages
