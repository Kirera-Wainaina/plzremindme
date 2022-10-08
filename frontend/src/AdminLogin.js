import { Alert, Button, Grid, LinearProgress, TextField, Card, Box, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export default class AdminLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            status: null,
            showLinearProgress: false,
            disableSubmit: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ showLinearProgress: true, disableSubmit: true })
        fetch('/api/admin/Login', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: { 'content-encoding': 'application/json'}
        }).then(response => this.handleResponse(response))
    }

    handleResponse(response) {
        if (response.status == 200) sessionStorage.setItem('isLoggedIn', true);
        this.setState({ status: response.status, showLinearProgress: false, disableSubmit: false })
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
                                this.state.status == 200 &&
                                <Alert severity="success">Successful Login</Alert>
                            }

                            <Typography variant='h6' align='center'>Login</Typography>

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

                            <Button variant="contained" 
                                type="submit" 
                                sx={{ mt: 2 }} 
                                disabled={this.state.disableSubmit}
                                fullWidth
                            >
                                Login
                            </Button>

                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Card sx={{ p: 5 }}>
                        <Link to='../admin-signup' className="card admin-link">
                        Please talk to the admin to sign you up if you don't have an account
                        </Link>

                    </Card>
                </Grid>

            </Grid>
        )
    }
}
