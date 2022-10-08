import { Alert, Card, Grid, LinearProgress, Typography, TextField, Button } from "@mui/material";
import { Box } from "@mui/system";
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
            status: null,
            showLinearProgress: false,
            disableSubmit: false
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
            ? this.setState({ passwordIsSame: true, showLinearProgress: true, disableSubmit: true }) 
            : this.setState({ passwordIsSame: false })
    }

    saveCredentials() {
        if (this.state.password == this.state.repeatPassword) {
            fetch('/api/admin/Signup', {
                method: 'POST',
                body: JSON.stringify(this.state),
                headers: { 'content-type': 'application/json'}
            }).then(response => this.handleResponse(response))
        }
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
            <Grid container justifyContent='center'>

                <Grid item xs={12} sm={6} sx={{ m: 5 }}>
                    <Card>
                        <Box
                            component='form'
                            onSubmit={this.handleSubmit}
                            sx={{ p: 5 }}
                        >
                            {
                                this.state.showLinearProgress && <LinearProgress />
                            }
                            {
                                this.state.status == 401 &&
                                <Alert severity="error">The email or password you entered is incorrect</Alert>
                            }
                            {
                                this.state.status == 500 &&
                                <Alert severity="error">Something happened. Our fault. Please try again later!</Alert>
                            }
                            {
                                this.state.status == 200 &&
                                <Alert severity="success">Successful Login</Alert>
                            }
                            {
                                !this.state.passwordIsSame &&
                                <Alert severity="info">Ensure Password and Repeat Password are same!</Alert>
                            }
                            
                            <Typography variant='h6' align='center'>Signup</Typography>

                            <TextField
                                label='First Name'
                                variant="outlined"
                                margin="normal"
                                name="firstName"
                                onChange={this.handleChange}
                                required
                                fullWidth
                            />
                            <TextField
                                label='Email'
                                variant="outlined"
                                margin="normal"
                                name="email"
                                type='email'
                                onChange={this.handleChange}
                                required
                                fullWidth
                            />
                            <TextField
                                label='Password'
                                variant="outlined"
                                margin="normal"
                                name="password"
                                type='password'
                                onChange={this.handleChange}
                                required
                                fullWidth
                            />
                            <TextField
                                label='Repeat Password'
                                variant="outlined"
                                margin="normal"
                                name="repeatPassword"
                                type='password'
                                onChange={this.handleChange}
                                required
                                fullWidth
                            />
                            <TextField
                                label='Admin Password'
                                variant="outlined"
                                margin="normal"
                                name="adminPassword"
                                type='password'
                                onChange={this.handleChange}
                                required
                                fullWidth
                            />
                            
                            <Button variant="contained" 
                                type="submit" 
                                sx={{ mt: 2 }} 
                                disabled={this.state.disableSubmit}
                                fullWidth
                            >
                                Signup
                            </Button>
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Card sx={{ p: 5 }}>
                        <Link to='../admin-login' className="card admin-link">
                            Please Login if you already have an account
                        </Link>
                    </Card>
                </Grid>

            </Grid>
        )
    }
}