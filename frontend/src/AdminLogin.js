import React from "react";

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
        fetch('/api/AdminLogin', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: { 'content-encoding': 'application/json'}
        }).then(response => this.setState({ status: response.status }))
    }

    render() {
        return (
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