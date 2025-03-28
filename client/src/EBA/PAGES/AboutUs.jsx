import React, { useState } from 'react'

import './About.css'

import Navbar from '../Navbar';

const AboutUs = () => {

    return (
        <div className="aboutus">
			<Navbar />

			<div className="header">
            	<h1>ABOUT</h1>
				<p>Meet our Capstone Developers</p>
			</div>

			<div className="members">
				<div className="ar team">
					<h2>AUGMENTED REALITY TEAM</h2>
					<div className="card-block">
						<div className="card">
							<div className="img-block">
								<img src='/developers/lee.png' />
							</div>
							<div className="text-block">
								<h3 className="mem-name">Edishan Lee Tenorio</h3>
								<p><i>"Lately I been, I been losing sleep"</i></p>
							</div>
						</div>
						<div className="card">
							<div className="img-block">
								<img src='/developers/paulo.png' />
							</div>
							<div className="text-block">
								<h3 className="mem-name">John Paulo Ramos</h3>
								<p><i>"mas pipiliin kong ma deds kung buhay ko'y di fresh"</i></p>
							</div>
						</div>
						<div className="card">
							<div className="img-block">
								<img src='/developers/wendell.png' />
							</div>
							<div className="text-block">
								<h3 className="mem-name">Chris Wendell Flaviano</h3>
								<p><i>"Everthing has its own beginning"</i></p>
							</div>
						</div>
						<div className="card">
							<div className="img-block">
								<img src='/developers/louie.png' />
							</div>
							<div className="text-block">
								<h3 className="mem-name">Louie Arceo</h3>
								<p><i>"Hindi ka makakarating sa patutunguhan kung di ka marunong lumingon sa pinanggalingan"</i></p>
							</div>
						</div>
						<div className="card">
							<div className="img-block">
								<img src='/developers/nino.png' />
							</div>
							<div className="text-block">
								<h3 className="mem-name">Aerold Nino Bautista</h3>
								<p><i>"Proseso bago Asenso"</i></p>
							</div>
						</div>
					</div>
				</div>

				<div className="modelling team">
					<h2>3D MODELLING TEAM</h2>
					<div className="card-block">
						<div className="card">
							<div className="img-block">
								<img src='/developers/mykel.png' />
							</div>
							<div className="text-block">
								<h3 className="mem-name">John Mykel Estoria</h3>
								<p><i>"Do not boast of tomorrow, for you do not know what a day may bring forth"</i></p>
							</div>
						</div>
						<div className="card">
							<div className="img-block">
								<img src='/developers/mar.png' />
							</div>
							<div className="text-block">
								<h3 className="mem-name">Rency Mar Tabangay</h3>
								<p><i>"If you want to buy things without looking at the price, work without looking at the clock"</i></p>
							</div>
						</div>
						<div className="card">
							<div className="img-block">
								<img src='/developers/jv.png' />
							</div>
							<div className="text-block">
								<h3 className="mem-name">JV Recierdo</h3>
								<p><i>"A comfort zone is a beautiful place, but nothing ever grows there"</i></p>
							</div>
						</div>
					</div>
				</div>

				<div className="eba-bulletin team">
				<h2>EBA BULLETIN TEAM</h2>
					<div className="card-block">
						<div className="card">
							<div className="img-block">
								<img src='/developers/blessel.png' />
							</div>
							<div className="text-block">
								<h3 className="mem-name">Dhaliane Blessel Palenzuela</h3>
								<p><i>"Programming isn't about what you know, it's about what you can figure out"</i></p>
							</div>
						</div>
						<div className="card">
							<div className="img-block">
								<img src='/developers/joy.png' />
							</div>
							<div className="text-block">
								<h3 className="mem-name">Mary Joy Hilab</h3>
								<p><i>"Be your own kind of beauty"</i></p>
							</div>
						</div>
						<div className="card">
							<div className="img-block">
								<img src='/developers/may.png' />
							</div>
							<div className="text-block">
								<h3 className="mem-name">Maria May Montano</h3>
								<p><i>"Life changes with every breath you take and every word you read"</i></p>
							</div>
						</div>
						<div className="card">
							<div className="img-block">
								<img src='/developers/andrei.png' />
							</div>
							<div className="text-block">
								<h3 className="mem-name">Marc Andrei Nisperos</h3>
								<p><i>"Well done is better than well said"</i></p>
							</div>
						</div>
					</div>
				</div>
			</div>
        </div>
    )
}

export default AboutUs