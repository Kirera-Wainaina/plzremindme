import React from 'react';
import { Link, Outlet } from 'react-router-dom';

import Menu from './Menu.js';

class Dashboard extends React.Component {
    
    render() {
        return (
            <div className='dashboard'>
                <Menu />
                <p>Hello, Dashboard</p>
                <Link to='signup'>Signup</Link>
                <Link to='login'>Login</Link>

                <Outlet />
            </div>
        )
    }
}

export default Dashboard;