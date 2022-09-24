import React from "react";
import { Link } from "react-router-dom";

export default class AdminLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            status: null
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit(e) {
        e.preventDefault();
        fetch('/api/admin/Login', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: { 'content-encoding': 'application/json'}
        }).then(response => this.handleResponse(response))
    }

    handleResponse(response) {
        if (response.status == 200) sessionStorage.setItem('isLoggedIn', true);
        this.setState({ status: response.status })
    }

    componentDidUpdate() {
        if (sessionStorage.getItem('isLoggedIn')) {
            location.pathname = '/admin/home'
        }
    }

    render() {
        return (
            <React.Fragment>
                <form className="card" onSubmit={this.handleSubmit}>
                    {this.state.status == 401 && <LoginError />}
                    <h2>Login</h2>
                    <label>Email 
                        <input required className='input' type='email' name='email' onChange={this.handleChange}/>
                    </label>
                    <label>Password 
                        <input required className='input' type='password' name='password' onChange={this.handleChange}/>
                    </label>
                    <input type='submit' value='Submit' className="button" />
                </form>
                <Link to='../signup' className="card admin-link">
                    Please talk to the admin to sign you up if you don't have an account
                </Link>
            </React.Fragment>
        )
    }
}

function LoginError() {
    return (
        <div className="error">
            <p>The email or password you entered is incorrect</p>
        </div>
    )
} 