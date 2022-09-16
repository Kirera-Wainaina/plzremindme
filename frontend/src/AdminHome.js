import React from "react";

import AdminSidebar from "./AdminSidebar";

export default class AdminHome extends React.Component {
    confirmLogin() {
        if (!sessionStorage.getItem('isLoggedIn')) {
            location.pathname = '/admin/login'
        }
    }

    render() {
        this.confirmLogin();

        return (
            <React.Fragment>
                <AdminSidebar />
            </React.Fragment>
        )
    }
}