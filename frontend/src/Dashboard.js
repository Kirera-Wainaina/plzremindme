import React from 'react';
import { Link, Outlet } from 'react-router-dom';

import Menu from './Menu.js';

class Dashboard extends React.Component {
    
    render() {
        return (
            <React.Fragment>
                <Menu />

                <Outlet />

            </React.Fragment>
        )
    }
}

export default Dashboard;