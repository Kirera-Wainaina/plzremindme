import Menu from './Menu.js';
import AdminSignup from './AdminSignup.js';

class Dashboard extends React.Component {
    render() {
        return (
            <div className='dashboard'>
                <Menu />
                <AdminSignup />
            </div>
        )
    }
}

export default Dashboard;