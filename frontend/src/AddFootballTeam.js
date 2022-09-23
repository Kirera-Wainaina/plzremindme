import { MenuItem, TextField, Box, Typography } from "@mui/material";
import React from "react";

export default class AddFootballTeam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            teamType: 'country'
        }
        
        this.handleTeamTypeChange = this.handleTeamTypeChange.bind(this);
    }

    handleTeamTypeChange(e) {
        this.setState({ teamType: e.target.value })
    }

    render() {
        return (
            <Box component='form'
                sx={{
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Typography variant='h6' align='center'>Add Team(s)</Typography>
                <TextField 
                    label='Team Name'
                    required
                    variant="filled"
                    margin="normal"
                />
                <TextField
                    label='Team Type'
                    required
                    variant='filled'
                    value={this.state.teamType}
                    select
                    onChange={this.handleTeamTypeChange}
                    margin="normal"
                >
                    {['Country', 'Club'].map((type, index) => (
                        <MenuItem key={index} value={type.toLowerCase()}>
                            {type}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>
        )
    }
}