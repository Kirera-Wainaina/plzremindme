import React from "react";
import { Link } from "react-router-dom";

export default class AdminSignup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: null,
            email: null,
            password: null,
            repeatPassword: null,
            adminPassword: null,
            passwordIsSame: true,
            status: null
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit(e) {
        e.preventDefault();
        this.comparePassword();
        this.saveCredentials();
    }

    comparePassword() {
        this.state.password === this.state.repeatPassword 
            ? this.setState({ passwordIsSame: true }) 
            : this.setState({ passwordIsSame: false })
    }

    saveCredentials() {
        if (this.state.password == this.state.repeatPassword) {
            fetch('/api/AdminSignup', {
                method: 'POST',
                body: JSON.stringify(this.state),
                headers: { 'content-type': 'application/json'}
            }).then(response => this.setState({status: response.status}))
        }
    }

    render() {
        return (
            <React.Fragment>
                <form className='card' onSubmit={this.handleSubmit}>
                    <h2>Signup</h2>
                    {!this.state.passwordIsSame && <PasswordError />}
                    {this.state.status && <ServerError status={this.state.status}/>}
                    <label>First Name 
                        <input required className="input" type='text' name='firstName' onChange={this.handleChange}/>
                    </label>
                    <label>Email 
                        <input required className='input' type='email' name='email' onChange={this.handleChange}/>
                    </label>
                    <label>Password 
                        <input required className='input' type='password' name='password' onChange={this.handleChange}/>
                    </label>
                    <label>Repeat Password 
                        <input required className='input' type='password' name='repeatPassword' onChange={this.handleChange}/>
                    </label>
                    <label>Admin Password 
                        <input required className='input' type='password' name='adminPassword' onChange={this.handleChange}/>
                    </label>
                    <input type='submit' value='Submit' className="button" />
                </form>
                <Link to='../login' className="card admin-link">Please Login if you already have an account</Link>
            </React.Fragment>
        )
    }
}

function PasswordError() {
    return (
        <div className="error">
            <p>The 'Repeat Password' should match 'Password'</p>
        </div>
    )
}

function ServerError(props) {
    const errMsg = {
        '401': <p>You are unauthorized to signup as an admin</p>,
        '500': <p>Something happened. Our fault. Please try again later!</p>
    };
    if (props.status == 200) return ;
    return (
        <div className="error">
            {errMsg[props.status]}
        </div>
    )
}