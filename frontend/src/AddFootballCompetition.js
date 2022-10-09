import { Grid, Box, Card, CardMedia, Typography, LinearProgress, Alert, TextField, 
    MenuItem, Button } from "@mui/material";
import React from "react";
import COUNTRIES from "./countries";

export default class AddFootballCompetition extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showLinearProgress: false,
            statusCode: null,
            name: '',
            category: 'league',
            level: 'international',
            country: 'England',
            teamType: 'country',
            logo: null,
            logoURL: null
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.openFileUpload = this.openFileUpload.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);

    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ showLinearProgress: true });

        const formdata = new FormData(e.target);
        this.uploadData(formdata);
    }

    uploadData(formdata) {
        fetch('/api/admin/AddFootballCompetition', {
            method: 'POST',
            body: formdata,
            headers: { 'content-encoding': 'multipart/form-data'}
        }).then(response => this.setState({
            statusCode: response.status,
            showLinearProgress: false,
            name: '',
            logo: ''
        }))
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value, statusCode: null })
    }

    openFileUpload(e) {
        const parent = e.target.parentElement;
        parent.querySelector('.invisible-file-upload').click();
    }

    handleFileUpload(e) {
        this.setState({ 
            logo: e.target.files[0], 
            logoURL: URL.createObjectURL(e.target.files[0])
        })
    }

    render() {
        return (
            <Grid container justifyContent='center'>
                <Grid item xs={12} sm={6}>
                    <Card sx={{ mt: 5, padding: 5 }}>
                        <Box component='form'
                            onSubmit={this.handleSubmit}
                        >

                            {this.state.showLinearProgress && <LinearProgress />}

                            {
                                this.state.statusCode == 200 &&
                                <Alert severity="success">The upload was successful</Alert>
                            }

                            {
                                this.state.statusCode == 500 &&
                                <Alert severity="error">
                                    An error occurred while adding the league/tournament. Please try again.
                                </Alert>
                            }

                            <Typography variant="h6" align="center">
                                Add Leagues & Tournaments
                            </Typography>

                            <TextField
                                label='Category'
                                variant="filled"
                                onChange={this.handleChange}
                                name='category'
                                value={this.state.category}
                                margin='normal'
                                select
                                required
                                fullWidth
                            >
                                {['League', 'Tournament'].map((category, index) => (
                                    <MenuItem key={index} value={category.toLowerCase()}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label='Name'
                                variant='filled'
                                name='name'
                                margin="normal"
                                value={this.state.name}
                                onChange={this.handleChange}
                                required
                                fullWidth
                            />

                            {
                                (this.state.category == 'league' || this.state.level == 'national') &&
                                <TextField
                                    label='Country'
                                    variant="filled"
                                    onChange={this.handleChange}
                                    name='country'
                                    value={this.state.country}
                                    margin='normal'
                                    select
                                    required
                                    fullWidth
                                >
                                    {COUNTRIES.map((country, index) => (
                                        <MenuItem key={index} value={country}>
                                            {country}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            }

                            {
                                this.state.category == 'tournament' &&
                                <TextField
                                    label='Level'
                                    variant="filled"
                                    onChange={this.handleChange}
                                    name='level'
                                    value={this.state.level}
                                    margin='normal'
                                    select
                                    required
                                    fullWidth
                                >
                                    {['National', 'International'].map((level, index) => (
                                        <MenuItem key={index} value={level.toLowerCase()}>
                                            {level}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            }

                            {
                                (this.state.category == 'tournament' && this.state.level == 'international') &&
                                <TextField
                                    label='Played By(Team Type)'
                                    variant="filled"
                                    onChange={this.handleChange}
                                    name='teamType'
                                    value={this.state.teamType}
                                    margin='normal'
                                    select
                                    required
                                    fullWidth
                                >
                                    {['Country', 'Club'].map((type, index) => (
                                        <MenuItem key={index} value={type.toLowerCase()}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            }

                            <Button
                                variant="outlined"
                                onClick={this.openFileUpload}
                                sx={{ my: 2 }}
                                fullWidth
                            >
                                Upload {this.state.category} Logo
                            </Button>

                            <input 
                                type='file'
                                className='invisible-file-upload'
                                name={`${this.state.name}-logo`}
                                onChange={this.handleFileUpload}
                            />

                            {
                                this.state.logo &&
                                <Card>
                                    <CardMedia
                                        component='img'
                                        height='180'
                                        image={this.state.logoURL}
                                        sx={{
                                            objectFit: 'contain'
                                        }}
                                    />
                                </Card>
                            }

                            <Button
                                variant="contained"
                                type='submit'
                                sx={{ mt: 3 }}
                                disabled={this.state.showLinearProgress}
                                fullWidth
                            >
                                Submit
                            </Button>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        )
    }
}