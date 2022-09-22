import React from "react";

import AdminPanel from "./AdminPanel";
import AdminFootball from "./AdminFootball";
import AdminFormula1 from "./AdminFormula1";
import Menu from "./Menu";

export default class AdminHome extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sportComponent: <AdminFormula1 />,
        }

        this.displayComponent = this.displayComponent.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
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
        console.log('clicked from home')
    }

    render() {
        this.confirmLogin();

        return (
            <React.Fragment>
                <Menu handleMenuClick={this.handleMenuClick}/>
                
                <AdminPanel 
                    component={this.displayComponent} 
                    sports={Object.keys(components)}
                />
                {this.state.sportComponent}
            </React.Fragment>
        )
    }
}

const components = {
    'Formula 1': <AdminFormula1 />,
    'Football': <AdminFootball />
}