import React from 'react';
import { Outlet } from 'react-router-dom';

class Dashboard extends React.Component {

    render() {
        return (
            <React.Fragment>
                <Outlet />
            </React.Fragment>
        )
    }
}

export default Dashboard;