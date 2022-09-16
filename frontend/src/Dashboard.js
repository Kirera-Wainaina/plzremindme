import React from 'react';
import { Link, Outlet } from 'react-router-dom';

import Menu from './Menu.js';

class Dashboard extends React.Component {
    
    render() {
        return (
            <div className='dashboard'>
                <Menu />
                <h2>Welcome to the Dashboard</h2>

                <Outlet />
            </div>
        )
    }
}

export default Dashboard;