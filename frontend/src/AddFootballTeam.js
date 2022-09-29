import { MenuItem, TextField, Box, Typography, Button, Alert, LinearProgress, Card, Grid, CardMedia } from "@mui/material";
import React from "react";
import './AddFootballTeam.css';

export default class AddFootballTeam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            teamType: 'country',
            clubCountry: 'England',
            teamName: '',
            teamLogo: null,
            teamLogoURL: null,
            statusCode: null,
            showLinearProgress: false
        }

        this.countries = ['England', 'Spain', 'France', 'Italy', 'Germany']
        
        this.handleChange = this.handleChange.bind(this);
        this.openFileUpload = this.openFileUpload.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
            teamLogo: e.target.files[0], 
            teamLogoURL: URL.createObjectURL(e.target.files[0])
        })
    }

    handleSubmit(e) {
        // handle submit
        e.preventDefault();
        this.setState({ showLinearProgress: true });
        const formdata = new FormData(e.target)
        this.uploadData(formdata)
    }

    uploadData(formdata) {
        fetch('/api/admin/AddFootballTeam', {
            method: 'POST',
            body: formdata,
            headers: { 'content-encoding': 'multipart/form-data'}
        })
        .then(response => this.setState({ 
            statusCode: response.status,
            showLinearProgress: false,
            teamName: '',
            teamLogo: null
        }))
    }

    render() {
        return (
            <Grid container justifyContent='center'>
                <Grid item xs={12} sm={6}>
                    <Card sx={{ 
                        mt: 5,
                        }}>
                        <Box component='form'
                            onSubmit={this.handleSubmit}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                padding: 5,
                            }}
                        >
                            {this.state.showLinearProgress && <LinearProgress />}
                            {this.state.statusCode == 200 && <Alert severity="success">The upload was successful!</Alert>}
                            <Typography variant='h6' align='center'>Add Team(s)</Typography>
                            <TextField 
                                label='Team Name'
                                variant="filled"
                                margin="normal"
                                name="teamName"
                                value={this.state.teamName}
                                onChange={this.handleChange}
                                required
                            />
                            <TextField
                                label='Team Type'
                                variant='filled'
                                value={this.state.teamType}
                                onChange={this.handleChange}
                                margin="normal"
                                name="teamType"
                                select
                                required
                            >
                                {['Country', 'Club'].map((type, index) => (
                                    <MenuItem key={index} value={type.toLowerCase()}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                            { 
                                this.state.teamType == 'club' && 
                                <TextField 
                                    label='Club country'
                                    variant='filled'
                                    margin="normal"
                                    value={this.state.clubCountry}
                                    name="clubCountry"
                                    onChange={this.handleChange}
                                    required
                                    select
                                >
                                    {this.countries.map((country, index) => (
                                        <MenuItem key={index} value={country}>
                                            {country}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            }
                            <Button variant="outlined" 
                                onClick={this.openFileUpload} 
                                sx={{ my: 2 }}
                            >
                                Upload Team Logo
                            </Button>
                            <input onChange={this.handleFileUpload} 
                                type='file' 
                                name={`${this.state.teamName}-logo`}
                                className="invisible-file-upload"/>

                            {this.state.teamLogo && <DisplayImage src={this.state.teamLogoURL}/>}

                            <Button variant="contained" 
                                type="submit" 
                                sx={{ m: 2 }} 
                            >
                                submit
                            </Button>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        )
    }
}

function DisplayImage(props) {
    return (
        <Card>
            <CardMedia
                component='img'
                height='180'
                image={props.src}
                sx={{
                    objectFit: 'contain'
                }}
            />
        </Card>
    )
}