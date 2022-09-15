import React from 'react';

import Menu from './Menu.js';
import AdminSignup from './AdminSignup.js';
import AdminLogin from './AdminLogin.js';

class Dashboard extends React.Component {
    render() {
        return (
            <div className='dashboard'>
                <Menu />
                {/* <AdminSignup /> */}
                <AdminLogin />
            </div>
        )
    }
}

export default Dashboard;