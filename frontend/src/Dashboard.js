import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Menu from './Menu.js';
import AdminSignup from './AdminSignup.js';
import AdminLogin from './AdminLogin.js';

class Dashboard extends React.Component {
    
    render() {
        return (
            <div className='dashboard'>
                <Menu />
                {/* <AdminSignup /> */}
                {/* <AdminLogin /> */}
                <p>Hello, Dashboard</p>
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