import React from "react";

import AdminSidebar from "./AdminSidebar";
import AdminFootball from "./AdminFootball";
import AdminFormula1 from "./AdminFormula1";

export default class AdminHome extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sportComponent: <AdminFormula1 />,
        }

        this.displayComponent = this.displayComponent.bind(this);
    }

    confirmLogin() {
        if (!sessionStorage.getItem('isLoggedIn')) {
            location.pathname = '/admin/login'
        }
    }

    displayComponent(id) {
        this.setState({ sportComponent: components[id] })
    }

    render() {
        this.confirmLogin();

        return (
            <React.Fragment>
                <AdminSidebar component={this.displayComponent}/>
                {this.state.sportComponent}
            </React.Fragment>
        )
    }
}

const components = {
    'AdminFormula1': <AdminFormula1 />,
    'AdminFootball': <AdminFootball />
}