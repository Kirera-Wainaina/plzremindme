import React from "react";

export default class AdminHome extends React.Component {
    confirmLogin() {
        if (!sessionStorage.getItem('isLoggedIn')) {
            location.pathname = '/admin/login'
        }
    }

    render() {
        this.confirmLogin();
        
        return (
            <p>Welcome home</p>
        )
    }
}