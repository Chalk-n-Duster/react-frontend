import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import {BrowserRouter} from 'react-router-dom'

class Footer extends Component {
    render() {
        return (
            <Menu >
                <Menu.Item>
                    Chalk 'n Duster (c) 
                </Menu.Item>
                <Menu.Item position="right">
                    Student's Portal
                </Menu.Item>
            </Menu>
        );
    }
}
export default Footer;