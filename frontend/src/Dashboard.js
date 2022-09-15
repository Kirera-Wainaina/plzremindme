import React from 'react';
import { Link, Outlet } from 'react-router-dom';

import Menu from './Menu.js';
import AdminSignup from './AdminSignup.js';
import AdminLogin from './AdminLogin.js';

class Dashboard extends React.Component {
    
    render() {
        return (
            <div className='dashboard'>
                <Menu />
                <p>Hello, Dashboard</p>
                <Link to='signup'>Signup</Link>
                <Link to='login'>Login</Link>

                <Outlet />
                {/* <AdminSignup /> */}
                {/* <AdminLogin /> */}
                {/* <Routes> */}
                    {/* <Route path='/' element={<AdminLogin />}/> */}
                    {/* <Route path='login' element={<AdminLogin />}/> */}
                    {/* <Route path='signup' element={<AdminSignup />} /> */}
                {/* </Routes> */}
            </div>
        )
    }
}

export default Dashboard;