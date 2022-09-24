import { MenuItem, TextField, Box, Typography, Button } from "@mui/material";
import React from "react";

export default class AddFootballTeam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            teamType: 'country',
            clubCountry: 'England',
            teamName: '',
            teamLogo: null
        }

        this.countries = ['England', 'Spain', 'France', 'Italy', 'Germany']
        
        this.handleChange = this.handleChange.bind(this);
        this.openFileUpload = this.openFileUpload.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    openFileUpload(e) {
        const parent = e.target.parentElement;
        parent.querySelector('.invisible-file-upload').click();
    }

    handleFileUpload(e) {
        this.setState({ teamLogo: e.target.files[0]})
    }

    handleSubmit(e) {
        // handle submit
        e.preventDefault();
        const formdata = this.appendToFormData();
        this.uploadData(formdata)
    }

    appendToFormData() {
        const formdata = new FormData();
        formdata.append('teamName', this.state.teamName);
        formdata.append('teamType', this.state.teamType);
        formdata.append('teamLogo', this.state.teamLogo);
        if (this.state.teamType == 'club') {
            formdata.append('clubCountry', this.state.clubCountry)
        }
        return formdata
    }

    uploadData(formdata) {
        fetch('/api/admin/AddFootballTeam', {
            method: 'POST',
            body: formdata,
            headers: { 'content-encoding': 'multipart/form-data'}
        })
        .then(response => console.log(response))
    }

    render() {
        return (
            <Box component='form'
                onSubmit={this.handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 5
                }}
            >
                <Typography variant='h6' align='center'>Add Team(s)</Typography>
                <TextField 
                    label='Team Name'
                    variant="filled"
                    margin="normal"
                    name="teamName"
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
                    className="invisible-file-upload"/>
                <Button variant="contained" 
                    type="submit" 
                    sx={{ m: 2 }} 
                >
                    submit
                </Button>
            </Box>
        )
    }
}