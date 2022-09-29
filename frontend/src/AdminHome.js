import React from "react";

import AdminPanel from "./AdminPanel";
import AdminFootball from "./AdminFootball";
import AdminFormula1 from "./AdminFormula1";
import Menu from "./Menu";

export default class AdminHome extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sportComponent: <AdminFootball />,
            panelOn: false
        }

        this.displayComponent = this.displayComponent.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }

    confirmLogin() {
        if (!sessionStorage.getItem('isLoggedIn')) {
            location.pathname = '/admin-login'
        }
    }

    displayComponent(id) {
        this.setState({ sportComponent: components[id] })
    }

    handleMenuClick() {
        this.setState({ panelOn: !this.state.panelOn });
    }

    handlePageClick(e) {
        if (e.target.id != 'admin-panel' && e.target.id != 'menu-icon') {
            // only turn off the panel if it's on
            if (this.state.panelOn) this.setState({ panelOn: ! this.state.panelOn });
        }
    }

    render() {
        this.confirmLogin();

        return (
            <div onClick={this.handlePageClick}>
                <Menu handleMenuClick={this.handleMenuClick}/>
                
                {
                    this.state.panelOn &&
                    <AdminPanel 
                        component={this.displayComponent} 
                        sports={Object.keys(components)}
                    />
                }
                {this.state.sportComponent}
            </div>
        )
    }
}

const components = {
    'Formula 1': <AdminFormula1 />,
    'Football': <AdminFootball />
}