import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { BrowserRouter } from 'react-router-dom'
import './navbar.css'
class Navbar extends Component {


	render() {

		return (
			<Menu style={{ marginTop: '10px' }} borderless>
				<Menu.Item >
					<p>All</p>
				</Menu.Item>
				<Menu.Item >
					<p>Maths</p>
				</Menu.Item>
				<Menu.Item >
					<p>Physics</p>
				</Menu.Item>
				<Menu.Item >
					<p>Chemistry</p>
				</Menu.Item>
				<Menu.Menu position='right'>
					<Menu.Item >
						<p>About</p>
					</Menu.Item>
					<Menu.Item >
						<p>Contact</p>
					</Menu.Item>
					<Menu.Item >
						<p>Help</p>
					</Menu.Item>
				</Menu.Menu>
			</Menu>
		);

	}
}


export default Navbar;