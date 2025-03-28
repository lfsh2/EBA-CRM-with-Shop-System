import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Bulletin from './BULLETIN/Bulletin';

import EBA from './EBA/EBA';
import AboutEBA from './EBA/PAGES/About';
import AboutDeveloper from './EBA/PAGES/AboutUs';

import EBALandingStore from './EBA/PAGES/EBASTORE/LandingStore';
import EBAUserLogin from './EBA/PAGES/EBASTORE/UserLogin';
import EBAStore from './EBA/PAGES/EBASTORE/Store';
import EBACart from './EBA/PAGES/EBASTORE/Cart';

import AdminLogin from './EBA/PAGES/ADMIN/AdminLogin';
import Adminpanel from './EBA/PAGES/ADMIN/AdminPanel';
import SuperAdminpanel from './EBA/PAGES/ADMIN/SuperAdminpanel';

import './App.css';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* BULLETIN PAGE */}
				<Route path='/' element={<Bulletin />}></Route>

				{/* EBA PAGE */}
				<Route path='/eba' element={<EBA />}></Route>
				<Route path='/abouteba' element={<AboutEBA />}></Route>
				<Route path='/aboutdeveloper' element={<AboutDeveloper />}></Route>

				{/* EBA STORE PAGE */}
				<Route path='/userlogin' element={<EBAUserLogin />}></Route>
				<Route path='/ebalandingstore' element={<EBALandingStore />}></Route>
				<Route path='/ebastore' element={<EBAStore />}></Route>
				<Route path='/ebacart' element={<EBACart />}></Route>

				{/* ADMIN PAGE */}
				<Route path='/adminlogin' element={<AdminLogin />}></Route>
				<Route path='/superadminpanel' element={<SuperAdminpanel />}></Route>
				<Route path='/adminpanel' element={<Adminpanel />}></Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
